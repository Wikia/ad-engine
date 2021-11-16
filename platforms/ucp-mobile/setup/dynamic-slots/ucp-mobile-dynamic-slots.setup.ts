import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	adSlotEvent,
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	hideCollapsedAdEvent,
	ofType,
	PorvataFiller,
	SlotCreator,
	slotService,
	templateService,
	uapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { filter, take } from 'rxjs/operators';
import {
	SlotSetupDefinition,
	UcpMobileSlotsDefinitionRepository,
} from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
	private CODE_PRIORITY = {
		floor_adhesion: {
			active: false,
		},
	};

	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: UcpMobileSlotsDefinitionRepository,
		private isUapLoaded: boolean,
	) {}

	execute(): void {
		this.registerUapChecker();
		this.injectSlots();
		this.configureAffiliateSlot();
		this.configureIncontentPlayer();
		this.configureInterstitial();
		this.registerTopLeaderboardCodePriority();
		this.registerFloorAdhesionCodePriority();
		this.registerAdPlaceholderHandler();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		this.insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getNativoIncontentAdConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getMobilePrefooterConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
			this.slotsDefinitionRepository.getNativoFeedAdConfig(),
		]);

		if (!topLeaderboardDefinition) {
			utils.listener(events.AD_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.dispatch(
					uapLoadStatus({ isLoaded: universalAdPackage.isFanTakeoverLoaded() }),
				);
			});
		}
	}

	private insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
		slotsToInsert
			.filter((config) => !!config)
			.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
				try {
					this.slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
					if (activator) {
						activator();
					}
				} catch (e) {
					slotsContext.setState(slotCreatorConfig.slotName, false);
				}
			});
	}

	private configureAffiliateSlot(): void {
		const slotName = 'affiliate_slot';
		const isApplicable =
			context.get('wiki.opts.enableAffiliateSlot') && !context.get('custom.hasFeaturedVideo');

		if (isApplicable) {
			slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
				templateService.init('affiliateDisclaimer', slotService.get(slotName));
			});
		} else {
			slotService.disable(slotName);
		}
	}

	private configureIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		slotService.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {});

		fillerService.register(new PorvataFiller());
	}

	private configureInterstitial(): void {
		const slotName = 'interstitial';

		slotService.on(slotName, AdSlot.SLOT_LOADED_EVENT, () => {
			this.styleInterstitial(slotService.get(slotName).getConfigProperty('insertId'));
		});

		slotService.on(slotName, AdSlot.SLOT_VIEWED_EVENT, () => {
			eventService.emit(events.INTERSTITIAL_DISPLAYED);
		});
	}

	private styleInterstitial(selector: string): void {
		const wrapper: HTMLElement = document.getElementById(selector);
		const iframe: HTMLIFrameElement = wrapper.firstElementChild
			.firstElementChild as HTMLIFrameElement;

		wrapper.style.backgroundColor = '#000000';

		const header: HTMLElement = iframe.contentWindow.document.querySelector(
			'#ad_position_box > .toprow',
		);
		const text: HTMLElement = iframe.contentWindow.document.querySelector('#heading > .text');
		const button: HTMLElement = iframe.contentWindow.document.querySelector(
			'#dismiss-button > div',
		);

		header.style.backgroundColor = '#002a32';
		button.style.border = '2px solid #00d6d6';
		button.style.borderRadius = '24px';
		button.style.width = '17px';
		button.style.textAlign = 'center';
		text.innerText = 'Advertisement';
	}

	private registerTopLeaderboardCodePriority(): void {
		const STICKY_SLOT_LOG_GROUP = 'sticky-tlb';

		if (
			!context.get('custom.hasFeaturedVideo') &&
			context.get('wiki.targeting.pageType') !== 'search'
		) {
			slotsContext.addSlotSize('top_leaderboard', [2, 2]);

			if (context.get('templates.stickyTlb.lineItemIds')) {
				utils.logger(
					STICKY_SLOT_LOG_GROUP,
					'Found sticky slot line-items IDs - enabling stickyTlb template for top_leaderboard slot',
				);

				context.set('templates.stickyTlb.enabled', true);
				context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
			} else {
				utils.logger(
					STICKY_SLOT_LOG_GROUP,
					'No sticky slot line-items IDs found - stickyTlb template disabled for top_leaderboard slot',
				);
			}
		}
	}

	private registerFloorAdhesionCodePriority(): void {
		slotService.on('floor_adhesion', AdSlot.STATUS_SUCCESS, () => {
			this.CODE_PRIORITY.floor_adhesion.active = true;

			eventService.on(events.VIDEO_AD_IMPRESSION, () => {
				if (this.CODE_PRIORITY.floor_adhesion.active) {
					this.CODE_PRIORITY.floor_adhesion.active = false;
					slotService.disable('floor_adhesion', AdSlot.STATUS_CLOSED_BY_PORVATA);
				}
			});

			eventService.on(events.INTERSTITIAL_DISPLAYED, () => {
				if (this.CODE_PRIORITY.floor_adhesion.active) {
					this.CODE_PRIORITY.floor_adhesion.active = false;
					slotService.disable('floor_adhesion', AdSlot.STATUS_CLOSED_BY_INTERSTITIAL);
				}
			});
		});

		slotService.on('floor_adhesion', AdSlot.HIDDEN_EVENT, () => {
			this.CODE_PRIORITY.floor_adhesion.active = false;
		});
	}

	private registerAdPlaceholderHandler(): void {
		const statusesToCollapse: string[] = [
			AdSlot.STATUS_BLOCKED,
			AdSlot.STATUS_COLLAPSE,
			AdSlot.STATUS_FORCED_COLLAPSE,
			AdSlot.HIDDEN_EVENT,
		];
		const statusesToStopLoadingSlot: string[] = [
			AdSlot.STATUS_SUCCESS,
			AdSlot.HIDDEN_EVENT,
			AdSlot.SLOT_RENDERED_EVENT,
		];
		const statusToUndoCollapse = 'forced_success';

		const shouldRemoveOrCollapse = (action: object): boolean => {
			return (
				statusesToStopLoadingSlot.includes(action['event']) ||
				statusesToCollapse.includes(action['event'])
			);
		};

		communicationService.action$
			.pipe(
				ofType(adSlotEvent),
				filter((action) => shouldRemoveOrCollapse(action)),
			)
			.subscribe((action) => {
				const adSlot = slotService.get(action.adSlotName);

				if (!adSlot) return;

				const placeholder = adSlot.getPlaceholder();
				const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

				if (placeholder) {
					if (
						action['event'] === AdSlot.SLOT_RENDERED_EVENT &&
						action['payload'][1] === statusToUndoCollapse
					) {
						placeholder?.classList.remove('hide');
						return;
					}

					if (
						statusesToStopLoadingSlot.includes(action['event']) &&
						placeholder.classList.contains('is-loading')
					) {
						placeholder.classList.remove('is-loading');
					}

					if (statusesToCollapse.includes(action['event'])) {
						if (this.isUapLoaded && !placeholder.classList.contains('hide')) {
							placeholder.classList.add('hide');
						} else {
							const adLabel = adSlot.getAdLabel(adLabelParent);
							if (adLabel && !adLabel.classList.contains('hide')) {
								adLabel.classList.add('hide');
								this.addMessageBoxToCollapsedElement(placeholder, adSlot);
							}
						}
					}
				}
			});
	}

	private addMessageBoxToCollapsedElement(placeholder: HTMLElement, adslot: AdSlot): void {
		const messageBox = document.createElement('div');
		messageBox.className = 'message-box';

		const button = document.createElement('button');
		button.className = 'collapse-btn';
		button.innerHTML = 'hide';
		button.onclick = () => placeholder.classList.add('hide');
		communicationService.dispatch(
			hideCollapsedAdEvent({
				adSlotName: adslot.getSlotName(),
				collapseButton: button,
				ad_status: 'clicked_collapse',
			}),
		);

		const message = document.createElement('p');
		message.innerHTML =
			'It looks like your ad has not been loaded... You can remove the gap by clicking the button below. Enjoy your fandom! :)';

		messageBox.append(message, button);
		placeholder.appendChild(messageBox);
	}

	private registerUapChecker(): void {
		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			this.isUapLoaded = action.isLoaded;
		});
	}
}
