import {
	GalleryLightboxAds,
	GalleryLightboxAdsHandler,
	insertSlots,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
	slotsContext,
	waitForPathFinder,
} from '@platforms/shared';
import {
	AdSlotEvent,
	AdSlotStatus,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	slotService,
	UapLoadStatus,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopFloorAdhesionExperiment } from '../experiments/ucp-desktop-floor-adhesion-experiment';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository,
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
		private galleryLightbox: GalleryLightboxAds,
		private ucpDesktopFloorAdhesionExperiment: UcpDesktopFloorAdhesionExperiment,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboardAndCompanions();
		this.configureFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
		this.handleGalleryLightboxAdsSlots();
	}

	private injectSlots(): void {
		insertSlots([
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig(),
			this.slotsDefinitionRepository.getTopLeaderboardConfig(),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getIncontentPlayerConfig(),
			this.slotsDefinitionRepository.getIncontentLeaderboardConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
		]);

		if (context.get('options.isFloorAdhesionNonUapApplicable')) {
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
			slotService.enable('floor_adhesion');
		} else if (this.ucpDesktopFloorAdhesionExperiment.isFloorAdhesionShowing()) {
			communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
				return insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
			});
		}

		communicationService.on(eventsRepository.RAIL_READY, () => {
			waitForPathFinder(() => {
				insertSlots([this.slotsDefinitionRepository.getIncontentBoxadConfig()]);
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
			AdSlotStatus.STATUS_SUCCESS,
			() => {
				porvataClosedActive = true;

				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => {
						if (!action.isLoaded || action.adProduct === 'ruap') {
							communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, () => {
								if (porvataClosedActive) {
									porvataClosedActive = false;
									slotService.disable(slotName);
								}
							});
						}
					},
				);
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlotEvent.HIDDEN_EVENT,
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

	private handleGalleryLightboxAdsSlots(): void {
		if (!this.galleryLightbox.initialized) {
			this.galleryLightbox.handler = new GalleryLightboxAdsHandler(this.slotsDefinitionRepository);
			this.galleryLightbox.initialized = true;
		}
		this.galleryLightbox.handler.handle();
	}
}
