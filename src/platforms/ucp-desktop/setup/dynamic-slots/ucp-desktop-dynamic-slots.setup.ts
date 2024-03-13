import {
	GalleryLightboxAds,
	GalleryLightboxAdsHandler,
	insertSlots,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
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
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpDesktopSlotsDefinitionRepository } from './ucp-desktop-slots-definition-repository';

@Injectable()
export class UcpDesktopDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository,
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
		private galleryLightbox: GalleryLightboxAds,
	) {}

	execute(): void {
		this.injectSlots();
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
		} else {
			communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () =>
				insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]),
			);
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
