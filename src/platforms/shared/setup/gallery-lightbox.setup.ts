import {
	AdSlotStatus,
	communicationService,
	eventsRepository,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { UcpDesktopSlotsDefinitionRepository } from '../../ucp-desktop/setup/dynamic-slots/ucp-desktop-slots-definition-repository';
import { UcpMobileSlotsDefinitionRepository } from '../../ucp-mobile/setup/dynamic-slots/ucp-mobile-slots-definition-repository';
import { insertSlots } from '../utils/insert-slots';

export class GalleryLightboxSetup {
	private readonly slotName = 'gallery_leaderboard';
	private refreshLock: boolean;
	private logGroup = 'gallery-lightbox-handler';
	private isActive: boolean;

	constructor(
		private slotsDefinitionRepository:
			| UcpMobileSlotsDefinitionRepository
			| UcpDesktopSlotsDefinitionRepository,
	) {
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
				this.hideFlorAdhesion();
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
				this.showFlorAdhesion();
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

	private hideFlorAdhesion() {
		const floor = document.getElementById('floor_adhesion_anchor');
		floor.classList.add('hide-under-lightbox');
	}

	private showFlorAdhesion() {
		const floor = document.getElementById('floor_adhesion_anchor');
		floor.classList.remove('hide-under-lightbox');
	}
}
