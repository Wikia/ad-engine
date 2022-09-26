import { communicationService, EventOptions, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary, slotService, utils } from '@ad-engine/core';
import { slotTrackingCompiler } from './compilers/slot-tracking-compiler';

const logGroup = 'ad-click-tracker';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
		click_position?: string;
	};
}

class AdClickTracker {
	private eventsToRegister = [
		eventsRepository.AD_ENGINE_VIDEO_LEARN_MORE_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_OVERLAY_CLICKED,
		eventsRepository.AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED,
	];

	register(callback: (data: Dictionary) => void): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ adSlotName }) => {
			this.addClickTrackingListeners(callback, adSlotName);
		});

		this.eventsToRegister.map((event) => this.addToTracking(event, callback));
	}

	private addToTracking(event: EventOptions, callback: (data: Dictionary) => void): void {
		communicationService.on(
			event,
			({ adSlotName, ad_status }) => {
				const trackingData: AdClickContext = {
					slot: slotService.get(adSlotName),
					data: {
						ad_status,
					},
				};

				callback(slotTrackingCompiler(trackingData));
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

		const trackingData: AdClickContext = {
			slot,
			data,
		};

		callback(slotTrackingCompiler(trackingData));
	}
}

export const adClickTracker = new AdClickTracker();
