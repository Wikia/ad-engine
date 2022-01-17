import {
	insertSlots,
	MessageBoxService,
	PlaceholderService,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	btfBlockerService,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	fillerService,
	PorvataFiller,
	slotService,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileSlotsDefinitionRepository } from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
	private CODE_PRIORITY = {
		floor_adhesion: {
			active: false,
		},
	};

	constructor(private slotsDefinitionRepository: UcpMobileSlotsDefinitionRepository) {}

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

		insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getNativoIncontentAdConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getMobilePrefooterConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
			this.slotsDefinitionRepository.getInvisibleHighImpactConfig(),
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getNativoFeedAdConfig(),
		]);

		if (!topLeaderboardDefinition) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
					isLoaded: universalAdPackage.isFanTakeoverLoaded(),
					adProduct: universalAdPackage.getType(),
				});
			});
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
		communicationService.onSlotEvent(
			AdSlot.SLOT_VIEWED_EVENT,
			() => {
				communicationService.emit(eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED);
			},
			'interstitial',
		);
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
		const slotName = 'floor_adhesion';
		const disableFloorAdhesionWithStatus = (status: string) => {
			this.CODE_PRIORITY.floor_adhesion.active = false;
			slotService.disable(slotName, status);
			document.getElementById('floor_adhesion_anchor').classList.add('hide');
		};

		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				this.CODE_PRIORITY.floor_adhesion.active = true;

				communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, () => {
					if (this.CODE_PRIORITY.floor_adhesion.active) {
						disableFloorAdhesionWithStatus(AdSlot.STATUS_CLOSED_BY_PORVATA);
					}
				});

				communicationService.on(
					eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED,
					() => {
						if (this.CODE_PRIORITY.floor_adhesion.active) {
							disableFloorAdhesionWithStatus(AdSlot.STATUS_CLOSED_BY_INTERSTITIAL);
						}
					},
					false,
				);
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlot.HIDDEN_EVENT,
			() => {
				this.CODE_PRIORITY.floor_adhesion.active = false;
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const messageBoxService = new MessageBoxService();
		const placeholderService = new PlaceholderService(messageBoxService);
		placeholderService.init();
	}
}
