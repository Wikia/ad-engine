import { eventService, slotTweaker } from '.';
import { AdSlot } from '../models';
import { logger } from '../utils';

const logGroup = 'slot-state-emitter';

function getAdType(event: googletag.events.SlotRenderEndedEvent, adSlot: AdSlot): string {
	const iframe = adSlot.getIframe();

	let isIframeAccessible = false;

	if (event.isEmpty) {
		return AdSlot.STATUS_COLLAPSE;
	}

	try {
		isIframeAccessible = !!iframe.contentWindow.document.querySelector;
	} catch (e) {
		logger(logGroup, 'getAdType', 'iframe is not accessible');
	}

	if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
		return iframe.contentWindow.AdEngine_adType;
	}

	return AdSlot.STATUS_SUCCESS;
}

class SlotStateEmitter {
	emitRenderEnded(event: googletag.events.SlotRenderEndedEvent, adSlot: AdSlot): void {
		const adType = getAdType(event, adSlot);

		adSlot.updateOnRenderEnd(event);

		switch (adType) {
			case 'collapse':
				adSlot.collapse();
				break;
			case 'manual':
				adSlot.setStatus(adType);
				break;
			default:
				adSlot.success();
		}

		adSlot.emit(AdSlot.SLOT_RENDERED_EVENT);
		logger(logGroup, AdSlot.SLOT_RENDERED_EVENT, adSlot.getSlotName());
	}

	emitLoadedEvent(event: googletag.events.SlotOnloadEvent, adSlot: AdSlot): void {
		adSlot.emit(AdSlot.SLOT_LOADED_EVENT);
		slotTweaker.setDataParam(adSlot, 'slotLoaded', true);
		logger(logGroup, AdSlot.SLOT_LOADED_EVENT, adSlot.getSlotName());
	}

	emitImpressionViewable(event: googletag.events.ImpressionViewableEvent, adSlot: AdSlot): void {
		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
		slotTweaker.setDataParam(adSlot, 'slotViewed', true);
		logger(logGroup, AdSlot.SLOT_VIEWED_EVENT, adSlot.getSlotName());
	}

	emitStatusChanged(adSlot: AdSlot): void {
		slotTweaker.setDataParam(adSlot, 'slotResult', adSlot.getStatus());
		eventService.emit(AdSlot.SLOT_STATUS_CHANGED, adSlot);
		logger(logGroup, AdSlot.SLOT_STATUS_CHANGED, adSlot.getSlotName());
	}

	emitCustomEvent(event: null | string, adSlot: AdSlot): void {
		eventService.emit(AdSlot.CUSTOM_EVENT, adSlot, { status: event });
		logger(logGroup, AdSlot.CUSTOM_EVENT, adSlot.getSlotName(), event);
	}
}

export const slotStateEmitter = new SlotStateEmitter();
