import {
	MessageBoxService,
	PlaceholderService,
	PlaceholderServiceHelper,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	events,
	eventService,
	fillerService,
	PorvataFiller,
	SlotCreator,
	slotService,
	uapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
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
	) {}

	execute(): void {
		this.injectSlots();
		this.configureIncontentPlayer();
		this.configureInterstitial();
		this.registerTopLeaderboardCodePriority();
		this.registerFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
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
					uapLoadStatus({
						isLoaded: universalAdPackage.isFanTakeoverLoaded(),
						adProduct: universalAdPackage.getType(),
					}),
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

	private configureIncontentPlayer(): void {
		const icpSlotName = 'incontent_player';

		slotService.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
		context.set(`slots.${icpSlotName}.customFiller`, 'porvata');
		context.set(`slots.${icpSlotName}.customFillerOptions`, {});

		fillerService.register(new PorvataFiller());
	}

	private configureInterstitial(): void {
		const slotName = 'interstitial';

		slotService.on(slotName, AdSlot.SLOT_VIEWED_EVENT, () => {
			eventService.emit(events.INTERSTITIAL_DISPLAYED);
		});
	}

	private registerTopLeaderboardCodePriority(): void {
		const STICKY_SLOT_LOG_GROUP = 'sticky-tlb';

		if (
			!context.get('custom.hasFeaturedVideo') &&
			context.get('wiki.targeting.pageType') !== 'search'
		) {
			slotsContext.addSlotSize('top_leaderboard', [2, 2]);

			if (context.get('templates.stickyTlb.lineItemIds')) {
				context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');

				utils.logger(
					STICKY_SLOT_LOG_GROUP,
					'Found sticky slot line-items IDs - enabling stickyTlb template for top_leaderboard slot',
				);
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

	private registerAdPlaceholderService(): void {
		const placeholderHelper = new PlaceholderServiceHelper();
		const messageBoxService = new MessageBoxService();
		const placeholderService = new PlaceholderService(placeholderHelper, messageBoxService);
		placeholderService.init();
	}
}
