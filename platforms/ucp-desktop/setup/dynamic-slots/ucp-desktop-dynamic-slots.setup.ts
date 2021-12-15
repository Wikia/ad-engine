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
	ofType,
	PorvataFiller,
	PorvataGamParams,
	SlotConfig,
	SlotCreator,
	slotInjector,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import {
	SlotSetupDefinition,
	UcpDesktopSlotsDefinitionRepository,
} from './ucp-desktop-slots-definition-repository';

const railReady = globalAction('[Rail] Ready');

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboard();
		this.configureBottomLeaderboard();
		this.configureIncontentPlayerFiller();
		this.registerFloorAdhesionCodePriority();
		// ToDo: ticket na placeholdery po cleanupie HiViLB
	}

	private injectSlots(): void {
		this.insertSlots([
			this.slotsDefinitionRepository.getNativoIncontentAdConfig(),
			this.slotsDefinitionRepository.getNativoFeedAdConfig(),
			this.slotsDefinitionRepository.getTopLeaderboardConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
		]);

		// ToDo: remove
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector || slots[slotName].parentContainerSelector) {
				slotInjector.inject(slotName, true);
			}
		});

		this.appendIncontentBoxad(slots['incontent_boxad_1']);
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

		utils.listener(events.AD_STACK_START, () => {
			rotator.rotateSlot();
		});
	}

	private handleAdPlaceholders(slotName: string, slotStatus: string): void {
		const statusesToHideLabel: string[] = [AdSlot.STATUS_BLOCKED, AdSlot.STATUS_COLLAPSE];
		const statusesToStopLoadingSlot: string[] = [AdSlot.STATUS_SUCCESS];
		const statusesToCollapse: string[] = [AdSlot.STATUS_FORCED_COLLAPSE];
		const adSlot = slotService.get(slotName);

		const placeholder = adSlot.getPlaceholder();
		const adLabelParent = adSlot.getConfigProperty('placeholder')?.adLabelParent;

		if (statusesToStopLoadingSlot.includes(slotStatus)) {
			placeholder?.classList.remove('is-loading');
		} else if (statusesToHideLabel.includes(slotStatus)) {
			placeholder?.classList.remove('is-loading');
			adSlot.getAdLabel(adLabelParent)?.classList.add('hide');
		} else if (statusesToCollapse.includes(slotStatus)) {
			placeholder?.classList.add('hide');
			adSlot.getAdLabel(adLabelParent)?.classList.add('hide');
		}
	}

	private configureTopLeaderboard(): void {
		const slotName = 'top_leaderboard';

		slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_SUCCESS);
		});

		slotService.on(slotName, AdSlot.STATUS_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_COLLAPSE);
		});

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('wiki.targeting.pageType') !== 'special') {
				slotsContext.addSlotSize(slotName, [3, 3]);
			}

			if (
				context.get('templates.stickyTlb.forced') ||
				context.get('templates.stickyTlb.lineItemIds')
			) {
				context.push(`slots.${slotName}.defaultTemplates`, 'stickyTlb');
			}
		}
	}

	private configureBottomLeaderboard(): void {
		const slotName = 'bottom_leaderboard';

		slotService.on(slotName, AdSlot.STATUS_SUCCESS, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_SUCCESS);
		});

		slotService.on(slotName, AdSlot.STATUS_BLOCKED, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_BLOCKED);
		});

		slotService.on(slotName, AdSlot.STATUS_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_COLLAPSE);
		});

		slotService.on(slotName, AdSlot.STATUS_FORCED_COLLAPSE, () => {
			this.handleAdPlaceholders(slotName, AdSlot.STATUS_FORCED_COLLAPSE);
		});
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
}
