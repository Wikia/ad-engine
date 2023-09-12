import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	communicationService,
	eventsRepository,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { insertSlots, SlotsDefinitionRepository } from '../utils/insert-slots';

export interface GalleryLightboxAds {
	handler: GalleryLightboxAdsHandler;
	initialized: boolean;
}

@Injectable()
export class GalleryLightboxAdsHandler {
	private readonly slotName = 'gallery_leaderboard';
	private refreshLock: boolean;
	private logGroup = 'gallery-lightbox-handler';
	private isActive: boolean;

	constructor(private slotsDefinitionRepository: SlotsDefinitionRepository) {
		this.refreshLock = false;
		this.isActive = true;
	}
	handle() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			this.handleOnLoadNoAd();
			this.handleOnLoad();
			this.handleOnChange();
			this.handleOnClose();
		});
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
				this.hideFloorAdhesion();
				this.initMobileGalleryAdPlaceholder();
				utils.logger(this.logGroup, 'Ad placement on Lightbox ready', placementId);
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
				this.showFloorAdhesion();
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

	private initMobileGalleryAdPlaceholder() {
		const callback = ({ slot }: { slot: AdSlot }) => {
			slot?.element?.parentElement?.parentElement?.classList.add('with-ad');
			slot?.element?.parentElement?.classList.remove('hide');
			slot?.enable();
		};
		communicationService.onSlotEvent(AdSlotEvent.SLOT_LOADED_EVENT, callback, this.slotName, true);
	}

	private hideFloorAdhesion() {
		setTimeout(() => {
			const floor = document?.getElementById('floor_adhesion_anchor');
			floor?.classList?.add('hide-under-lightbox');
		}, 100);
	}

	private showFloorAdhesion() {
		const floor = document?.getElementById('floor_adhesion_anchor');
		floor?.classList?.remove('hide-under-lightbox');
	}
}
