import { communicationService, EventOptions, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary, slotService, utils } from '@ad-engine/core';
import { slotTrackingCompiler } from './compilers';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';

const logGroup = 'ad-click-tracker';

class AdClickTracker extends BaseTracker implements BaseTrackerInterface {
	private eventsToRegister = [
		eventsRepository.AD_ENGINE_VIDEO_LEARN_MORE_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_OVERLAY_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED,
	];
	compilers = [slotTrackingCompiler];

	isEnabled = () => true;

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
		const adSlot = slotService.get(slotName);
		const iframeElement = adSlot.getIframe();
		const slotElement = adSlot.getAdContainer();

		if (!adSlot || !iframeElement) {
			utils.logger(logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (adSlot.getFrameType() === 'safe') {
			utils.logger(logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}

		const iframeBody = iframeElement?.contentWindow?.document?.body;

		if (iframeBody && slotElement) {
			slotElement.firstElementChild.addEventListener('click', () => {
				this.handleClickEvent(callback, adSlot);
			});
			iframeBody.addEventListener('click', (e) => {
				this.handleClickEvent(callback, adSlot, e);
			});
		}
	}

	private handleClickEvent(
		callback: (data: Dictionary) => void,
		slot: AdSlot,
		event?: MouseEvent,
	): void {
		const data = {
			ad_status: AdSlot.STATUS_CLICKED,
		};
		if (event) {
			const target = event.target as HTMLElement;
			const clickData = {
				click: { x: event.clientX, y: event.clientY },
				size: { x: target.offsetWidth, y: target.offsetHeight },
			};
			data['click_position'] = JSON.stringify(clickData);
		}

		callback(this.compileData(slot, null, data));
	}
}

export const adClickTracker = new AdClickTracker();
