import { insertSlots } from '@platforms/shared';
import {
	AdSlotStatus,
	communicationService,
	eventsRepository,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { UcpDesktopSlotsDefinitionRepository } from '../ucp-desktop-slots-definition-repository';

export default class GalleryLightboxHandler {
	private readonly slotName = 'gallery_leaderboard';
	private refreshLock;
	private logGroup = 'gallery-lightbox-handle';

	constructor(private slotsDefinitionRepository: UcpDesktopSlotsDefinitionRepository) {
		this.refreshLock = false;
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
				utils.logger(this.logGroup, 'Ad placement on Lightbox ready', placementId);

				if (placementId !== this.slotName) {
					return;
				}

				insertSlots([this.slotsDefinitionRepository.getGalleryLeaderboardConfig()]);
				this.changeVisibilityOfParentSlotPlaceholder(true);
				this.lockForFewSeconds();
			},
			false,
		);
	}

	private changeVisibilityOfParentSlotPlaceholder(makeVisible: boolean) {
		const holder: HTMLElement = <HTMLElement>(
			document.querySelector('.ad-slot-placeholder.gallery-leaderboard')
		);
		if (!holder) {
			return;
		}
		holder.setAttribute('style', !makeVisible ? 'display: none;' : '');
	}

	private handleOnLoadNoAd(): void {
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_COLLAPSE,
			({ slot }) => {
				if (slot.getStatus() !== AdSlotStatus.STATUS_COLLAPSE) {
					return;
				}
				this.changeVisibilityOfParentSlotPlaceholder(false);
				this.refreshLock = true;
			},
			this.slotName,
		);
	}

	private handleOnClose(): void {
		communicationService.on(
			eventsRepository.PLATFORM_LIGHTBOX_CLOSED,
			({ placementId }) => {
				utils.logger(this.logGroup, 'Ad placement on Lightbox destroy', placementId);

				if (placementId !== this.slotName) {
					return;
				}

				const gallerySlot = slotService.get(this.slotName);
				if (!gallerySlot) {
					return;
				}

				gallerySlot.destroy();
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

				if (placementId !== this.slotName || this.refreshLock) {
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
