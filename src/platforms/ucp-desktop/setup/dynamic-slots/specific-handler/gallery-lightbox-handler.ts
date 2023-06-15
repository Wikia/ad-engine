import { insertSlots } from '@platforms/shared';
import {
	AdSlotStatus,
	communicationService,
	eventsRepository,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { UcpDesktopSlotsDefinitionRepository } from '../ucp-desktop-slots-definition-repository';

export class GalleryLightboxHandler {
	private readonly slotName = 'gallery_leaderboard';
	private refreshLock: boolean;
	private logGroup = 'gallery-lightbox-handler';
	private isActive: boolean;

	constructor(private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository) {
		this.refreshLock = false;
		this.isActive = true;
	}
	handle() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			this.handleOnLoadNoAd();
			this.handleOnLoad();
			this.handleOnClose();
			this.handleOnChange();
		});
	}

	private handleOnLoad(): void {
		communicationService.on(
			eventsRepository.PLATFORM_LIGHTBOX_READY,
			({ placementId }) => {
				if (placementId !== this.slotName) {
					return;
				}

				insertSlots([this.slotsDefinitionRepository.getGalleryLeaderboardConfig()]);
				this.lockForFewSeconds();
				this.isActive = true;
				utils.logger(this.logGroup, 'Ad placement on Lightbox ready', placementId);
			},
			false,
		);
	}

	private handleOnLoadNoAd(): void {
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_COLLAPSE,
			() => {
				this.refreshLock = true;
			},
			this.slotName,
		);
	}

	private handleOnClose(): void {
		communicationService.on(
			eventsRepository.PLATFORM_LIGHTBOX_CLOSED,
			({ placementId }) => {
				if (placementId !== this.slotName) {
					return;
				}

				const gallerySlot = slotService.get(this.slotName);
				if (!gallerySlot) {
					return;
				}

				gallerySlot.destroy();
				utils.logger(this.logGroup, 'Ad placement on Lightbox destroy', placementId);
				this.isActive = false;
			},
			false,
		);
	}

	private handleOnChange(): void {
		communicationService.on(
			eventsRepository.PLATFORM_LIGHTBOX_IMAGE_CHANGE,
			({ placementId }) => {
				utils.logger(
					this.logGroup,
					'Ad placement on Lightbox is going to be refreshed',
					placementId,
				);

				if (placementId !== this.slotName || this.refreshLock || !this.isActive) {
					return;
				}

				const gallerySlot = slotService.get(placementId);
				if (!gallerySlot) {
					return;
				}

				gallerySlot.destroy();
				gallerySlot.getElement().remove();
				const label = document.querySelector(
					`.ae-translatable-label[data-slot-name="${this.slotName}"]`,
				);
				if (label) {
					label.remove();
				}
				setTimeout(() => {
					insertSlots([this.slotsDefinitionRepository.getGalleryLeaderboardConfig()]);
				}, 100);

				this.lockForFewSeconds();
			},
			false,
		);
	}

	private lockForFewSeconds() {
		this.refreshLock = true;
		setTimeout(() => {
			this.refreshLock = false;
		}, 2000);
	}
}
