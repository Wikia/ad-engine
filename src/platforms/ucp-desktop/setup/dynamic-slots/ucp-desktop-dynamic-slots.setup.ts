import {
	insertSlots,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	slotService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopPerformanceAdsDefinitionRepository } from './ucp-desktop-performance-ads-definition-repository';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository,
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
		private performanceAdsDefinitionRepository: UcpDesktopPerformanceAdsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboardAndCompanions();
		this.configureFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
	}

	private injectSlots(): void {
		insertSlots([
			this.nativoSlotDefinitionRepository.getNativoIncontentAdConfig(2),
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig(),
			this.slotsDefinitionRepository.getTopLeaderboardConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentLeaderboardConfig(2),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
		]);

		communicationService.on(eventsRepository.RAIL_READY, () => {
			insertSlots([this.slotsDefinitionRepository.getIncontentBoxadConfig()]);

			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				this.performanceAdsDefinitionRepository.setup();
			});
		});
		communicationService.on(
			eventsRepository.QUIZ_AD_INJECTED,
			({ slotId }) => {
				insertSlots([this.quizSlotsDefinitionRepository.getQuizAdConfig(slotId)]);
			},
			false,
		);
	}

	private configureTopLeaderboardAndCompanions(): void {
		const slotName = 'top_leaderboard';
		const fvPageReducedSizes = [
			[728, 90],
			[970, 66],
			[970, 90],
			[970, 150],
			[970, 180],
			[970, 250],
		];

		slotsContext.addSlotSize(
			'top_boxad',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
		);

		if (!context.get('custom.hasFeaturedVideo') || context.get('templates.stickyTlb.withFV')) {
			context.push(`slots.${slotName}.defaultTemplates`, 'stickyTlb');
		}

		if (!context.get('custom.hasFeaturedVideo')) {
			if (context.get('wiki.targeting.pageType') !== 'special') {
				slotsContext.addSlotSize(slotName, universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop);
				slotsContext.addSlotSize(slotName, universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.unified);
			}

			slotsContext.addSlotSize(
				'incontent_boxad_1',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
			);
		} else {
			context.set(`slots.${slotName}.sizes`, [
				{
					viewportSize: [1024, 0],
					sizes: fvPageReducedSizes,
				},
			]);
			context.set('slots.incontent_boxad_1.defaultSizes', [[300, 250]]);
			slotsContext.addSlotSize(
				'incontent_boxad_1',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
		}
	}

	private configureFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		let porvataClosedActive = false;

		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			() => {
				porvataClosedActive = true;

				communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, () => {
					if (porvataClosedActive) {
						porvataClosedActive = false;
						slotService.disable(slotName);
					}
				});
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlot.HIDDEN_EVENT,
			() => {
				porvataClosedActive = false;
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const placeholderService = new PlaceholderService();
		placeholderService.init();
	}
}
