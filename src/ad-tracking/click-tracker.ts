import { communicationService, EventOptions, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary, slotService, utils } from '@ad-engine/core';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import { slotTrackingCompiler } from './compilers';

const logGroup = 'ad-click-tracker';

class AdClickTracker extends BaseTracker implements BaseTrackerInterface {
	private eventsToRegister = [
		eventsRepository.AD_ENGINE_VIDEO_LEARN_MORE_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_OVERLAY_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED,
	];
	compilers = [slotTrackingCompiler];

	register(callback): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ adSlotName }) => {
			this.addClickTrackingListeners(callback, adSlotName);
		});

		this.eventsToRegister.map((event) => this.addToTracking(event, callback));
	}

	private addToTracking(event: EventOptions, callback: (data: Dictionary) => void): void {
		communicationService.on(
			event,
			({ adSlotName, ad_status }) => {
				callback(this.compileData(slotService.get(adSlotName), null, { ad_status }));
			},
			false,
		);
	}

	private addClickTrackingListeners(callback: (data: Dictionary) => void, slotName): void {
		this.clickDetection(slotName, callback);
	}

	private clickDetection(slotName: string, callback: (data: Dictionary) => void) {
		const eventHandler = () => {
			const elem = document.activeElement;
			if (!elem) {
				return;
			}

			const currentPlacementId = elem.closest(`div#${slotName}`) !== null;
			if (!currentPlacementId) {
				return;
			}

			utils.logger(logGroup, `Click! on slot='${slotName}' is detected.`);

			const adSlot = slotService.get(slotName);
			this.handleClickEvent(callback, adSlot);
			setTimeout(() => {
				(document.activeElement as HTMLBodyElement).blur();
			}, 100);
		};

		window.addEventListener('blur', eventHandler);
	}

	private handleClickEvent(callback: (data: Dictionary) => void, slot: AdSlot): void {
		const data = {
			ad_status: AdSlot.STATUS_CLICKED,
		};

		callback(this.compileData(slot, null, data));
	}
}

export const adClickTracker = new AdClickTracker();
