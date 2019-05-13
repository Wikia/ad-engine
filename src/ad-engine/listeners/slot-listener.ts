import { AdSlot } from '../models';
import { context, slotInjector, slotTweaker } from '../services';
import { client, logger } from '../utils';

interface AdditionalEventData {
	adType: string;
	status: string;
	event: googletag.events.SlotRenderEndedEvent;
}

export interface AdSlotData {
	browser: string;
	time_bucket: number;
	timestamp: number;
	tz_offset: number;
	adType: string;
	status: string;
	creative_id: string | number;
	creative_size: string | number[];
	line_item_id: string | number;
	order_id: string | number;
	page_width: string | number;
	viewport_height: number;
}

const logGroup = 'slot-listener';

let listeners = null;

function getIframe(adSlot) {
	return adSlot.getElement().querySelector('div[id*="_container_"] iframe');
}

function getAdType(event, adSlot) {
	const iframe = getIframe(adSlot);

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

function getData(adSlot: AdSlot, { adType, status }: Partial<AdditionalEventData>): AdSlotData {
	const now = new Date();

	return {
		browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
		adType: adType || '',
		order_id: adSlot.orderId,
		creative_id: adSlot.creativeId,
		creative_size:
			Array.isArray(adSlot.creativeSize) && adSlot.creativeSize.length
				? adSlot.creativeSize.join('x')
				: adSlot.creativeSize,
		line_item_id: adSlot.lineItemId,
		status: status || adSlot.getStatus(),
		page_width: window.document.body.scrollWidth || '',
		time_bucket: now.getHours(),
		timestamp: now.getTime(),
		tz_offset: now.getTimezoneOffset(),
		viewport_height: window.innerHeight || 0,
	};
}

function dispatch(methodName, adSlot, adInfo: Partial<AdditionalEventData> = {}) {
	if (!listeners) {
		listeners = context
			.get('listeners.slot')
			.filter((listener) => !listener.isEnabled || listener.isEnabled());
	}

	const data = getData(adSlot, adInfo);

	listeners.forEach((listener) => {
		if (typeof listener[methodName] !== 'function') {
			return;
		}

		listener[methodName](adSlot, data);
	});
	logger(logGroup, methodName, adSlot, adInfo, data);
}

class SlotListener {
	emitRenderEnded(event: googletag.events.SlotRenderEndedEvent, adSlot) {
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
				break;
		}

		const slotsToPush = context.get(`events.pushAfterRendered.${adSlot.getSlotName()}`);

		if (slotsToPush) {
			slotsToPush.forEach((slotName) => {
				slotInjector.inject(slotName);
			});
		}

		dispatch('onRenderEnded', adSlot, { adType, event });
	}

	emitLoadedEvent(event, adSlot) {
		adSlot.emit(AdSlot.SLOT_LOADED_EVENT);
		dispatch('onLoaded', adSlot);
		slotTweaker.setDataParam(adSlot, 'slotLoaded', true);
	}

	emitImpressionViewable(event, adSlot) {
		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
		dispatch('onImpressionViewable', adSlot);
		slotTweaker.setDataParam(adSlot, 'slotViewed', true);
	}

	emitStatusChanged(adSlot) {
		slotTweaker.setDataParam(adSlot, 'slotResult', adSlot.getStatus());
		dispatch('onStatusChanged', adSlot);
	}

	emitCustomEvent(event, adSlot) {
		dispatch('onCustomEvent', adSlot, { status: event });
	}
}

export const slotListener = new SlotListener();
