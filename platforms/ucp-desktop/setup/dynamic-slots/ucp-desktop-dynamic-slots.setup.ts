import { slotsContext } from '@platforms/shared';
import {
	AdSlot,
	btRec,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	events,
	eventService,
	fillerService,
	FmrRotator,
	globalAction,
	nativo,
	ofType,
	placeholderService,
	PorvataFiller,
	PorvataGamParams,
	scrollListener,
	SlotConfig,
	slotInjector,
	slotService,
	TemplateRegistry,
	uapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import {
	isNativeAdApplicable,
	NATIVE_AD_SLOT_CLASS_LIST,
	NATIVE_AD_SLOT_NAME,
} from '../../../shared/utils/native-ads-helper';

const railReady = globalAction('[Rail] Ready');

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(private templateRegistry: TemplateRegistry) {}

	execute(): void {
		this.injectSlots();
		this.injectIncontentPlayer();
		this.injectAffiliateDisclaimer();
		this.injectFloorAdhesion();
		this.injectBottomLeaderboard();
		this.injectNativeAdsPlaceholder();
		this.configureTopLeaderboard();
		this.configureIncontentPlayerFiller();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector || slots[slotName].parentContainerSelector) {
				slotInjector.inject(slotName, true);
			}
		});

		this.appendIncontentBoxad(slots['incontent_boxad_1']);
	}

	private appendIncontentBoxad(slotConfig: SlotConfig): void {
		const icbSlotName = 'incontent_boxad_1';

		if (context.get('custom.hasFeaturedVideo')) {
			context.set(`slots.${icbSlotName}.defaultSizes`, [300, 250]);
		}

		communicationService.action$.pipe(ofType(railReady), take(1)).subscribe(() => {
			const parent = document.querySelector<HTMLDivElement>(slotConfig.parentContainerSelector);

			if (parent) {
				this.appendRotatingSlot(icbSlotName, slotConfig.repeat.slotNamePattern, parent);
			}
		});
	}

	private injectNativeAdsPlaceholder(): void {
		if (!isNativeAdApplicable()) {
			return;
		}

		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (!action.isLoaded) {
				const pageHeaders = document.querySelectorAll('.mw-headline');
				const anchor = pageHeaders[1];

				if (!!anchor) {
					const container = document.createElement('div');
					container.setAttribute('id', NATIVE_AD_SLOT_NAME);
					container.classList.add(...NATIVE_AD_SLOT_CLASS_LIST);

					anchor.before(container);

					nativo.start();
				}
			}
		});
	}

	private injectIncontentPlayer(): void {
		if (context.get('custom.hasIncontentPlayer')) {
			if (context.get('services.distroScale.enabled')) {
				context.push('state.adStack', { id: 'incontent_player' });
			} else {
				context.push('events.pushOnScroll.ids', 'incontent_player');
			}
		}
	}

	private configureIncontentPlayerFiller(): void {
		const icpSlotName = 'incontent_player';
		const fillerOptions: Partial<PorvataGamParams> = {
			enableInContentFloating: true,
		};

		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, fillerOptions);

		fillerService.register(new PorvataFiller());
	}

	private appendRotatingSlot(
		slotName: string,
		slotNamePattern: string,
		parentContainer: HTMLElement,
	): void {
		const container = document.createElement('div');
		const prefix = slotNamePattern.replace(slotNamePattern.match(/({.*})/g)[0], '');
		const rotator = new FmrRotator(slotName, prefix, btRec);

		container.id = slotName;
		parentContainer.appendChild(container);
		rotator.rotateSlot();
	}

	private configureTopLeaderboard(): void {
		const slotName = 'top_leaderboard';
		const hiviLBEnabled =
			context.get('options.hiviLeaderboard') && !context.get('options.wad.blocking');

		if (hiviLBEnabled) {
			context.set('slots.top_leaderboard.firstCall', false);

			slotService.on('hivi_leaderboard', AdSlot.STATUS_SUCCESS, () => {
				slotService.setState('top_leaderboard', false);
				placeholderService.stopLoading(slotName);
			});

			slotService.on('hivi_leaderboard', AdSlot.STATUS_FORCED_COLLAPSE, () => {
				slotService.setState('top_leaderboard', false);
				placeholderService.stopLoading(slotName);
				placeholderService.hidePlaceholder(slotName);
			});

			slotService.on('hivi_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
				const adSlot = slotService.get('hivi_leaderboard');

				if (!adSlot.isEmpty) {
					slotService.setState('top_leaderboard', false);
					placeholderService.stopLoading(slotName);
				}
			});
		}

		slotService.on('top_leaderboard', AdSlot.STATUS_SUCCESS, () => {
			placeholderService.stopLoading(slotName);
		});
		slotService.on('top_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
			placeholderService.stopLoading(slotName);
			placeholderService.hidePlaceholder(slotName);
		});

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('wiki.targeting.pageType') !== 'special') {
				slotsContext.addSlotSize(hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard', [3, 3]);
			}

			if (context.get('templates.stickyTlb.forced')) {
				context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
				context.push('slots.hivi_leaderboard.defaultTemplates', 'stickyTlb');
			} else if (context.get('templates.stickyTlb.lineItemIds')) {
				context.set('templates.stickyTlb.enabled', true);
				context.push(
					`slots.${hiviLBEnabled ? 'hivi_leaderboard' : 'top_leaderboard'}.defaultTemplates`,
					'stickyTlb',
				);
			}
		}
	}

	private injectAffiliateDisclaimer(): void {
		slotService.on('affiliate_slot', AdSlot.STATUS_SUCCESS, () => {
			this.templateRegistry.init('affiliateDisclaimer', slotService.get('affiliate_slot'));
		});
	}

	private injectFloorAdhesion(): void {
		const numberOfViewportsFromTopToPush: number =
			context.get('options.floorAdhesionNumberOfViewportsFromTopToPush') || 0;

		if (numberOfViewportsFromTopToPush === -1) {
			context.push('state.adStack', { id: 'floor_adhesion' });
		} else {
			const distance = numberOfViewportsFromTopToPush * utils.getViewportHeight();
			scrollListener.addSlot('floor_adhesion', { distanceFromTop: distance });
		}

		this.registerFloorAdhesionCodePriority();
	}

	private registerFloorAdhesionCodePriority(): void {
		let porvataClosedActive = false;

		slotService.on('floor_adhesion', AdSlot.STATUS_SUCCESS, () => {
			porvataClosedActive = true;

			eventService.on(events.VIDEO_AD_IMPRESSION, () => {
				if (porvataClosedActive) {
					porvataClosedActive = false;
					slotService.disable('floor_adhesion', AdSlot.STATUS_CLOSED_BY_PORVATA);
				}
			});
		});

		slotService.on('floor_adhesion', AdSlot.HIDDEN_EVENT, () => {
			porvataClosedActive = false;
		});
	}

	private injectBottomLeaderboard(): void {
		const slotName = 'bottom_leaderboard';

		context.push('events.pushOnScroll.ids', slotName);

		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			if (slot.getSlotName() === slotName && btRec.isEnabled() && btRec.duplicateSlot(slotName)) {
				btRec.triggerScript();
			}
		});

		slotService.on('bottom_leaderboard', AdSlot.STATUS_SUCCESS, () => {
			placeholderService.stopLoading(slotName);
		});
		slotService.on('bottom_leaderboard', AdSlot.STATUS_COLLAPSE, () => {
			placeholderService.stopLoading(slotName);
		});
		slotService.on('bottom_leaderboard', AdSlot.STATUS_BLOCKED, () => {
			placeholderService.stopLoading(slotName);
		});
	}
}
