import { AdSlot, Dictionary } from '../models';
import { context, slotInjector, slotTweaker } from '../services';
import { client, logger } from '../utils';

interface AdditionalEventData {
	adType: string;
	status: string;
	event: googletag.events.SlotRenderEndedEvent;
}

interface AdSlotListener {
	isEnabled?: () => boolean;
	onCustomEvent?: (adSlot: AdSlot, data: Dictionary) => void;
	onImpressionViewable?: (adSlot: AdSlot, data: Dictionary) => void;
	onLoaded?: (adSlot: AdSlot, data: Dictionary) => void;
	onRenderEnded?: (adSlot: AdSlot, data: Dictionary) => void;
	onStatusChanged?: (adSlot: AdSlot, data: Dictionary) => void;
}

type SlotListenerMethod =
	| 'onCustomEvent'
	| 'onImpressionViewable'
	| 'onLoaded'
	| 'onRenderEnded'
	| 'onStatusChanged';

export interface AdSlotData {
	advertiser_id: string;
	browser: string;
	time_bucket: number;
	timestamp: number;
	tz_offset: number;
	adType: string;
	status: string;
	creative_id: string | number;
	creative_size: string;
	line_item_id: string | number;
	order_id: string | number;
	page_width: string | number;
	viewport_height: number;
}

const logGroup = 'slot-listener';

let listeners: AdSlotListener[] = null;

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

function getData(adSlot: AdSlot, { adType, status }: Partial<AdditionalEventData>): AdSlotData {
	const now = new Date();

	return {
		browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
		adType: adType || '',
		advertiser_id: adSlot.advertiserId,
		order_id: adSlot.orderId,
		creative_id: adSlot.creativeId,
		creative_size: Array.isArray(adSlot.creativeSize)
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

function dispatch(
	methodName: SlotListenerMethod,
	adSlot: AdSlot,
	adInfo: Partial<AdditionalEventData> = {},
): void {
	if (!listeners) {
		listeners = context
			.get('listeners.slot')
			.filter((listener: AdSlotListener) => !listener.isEnabled || listener.isEnabled());
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

		const slotsToPush = context.get(`events.pushAfterRendered.${adSlot.getSlotName()}`);

		if (slotsToPush) {
			slotsToPush.forEach((slotName: string) => {
				slotInjector.inject(slotName);
			});
		}

		dispatch('onRenderEnded', adSlot, { adType, event });
		adSlot.emit(AdSlot.SLOT_RENDERED_EVENT);
	}

	emitLoadedEvent(event: googletag.events.SlotOnloadEvent, adSlot: AdSlot): void {
		adSlot.emit(AdSlot.SLOT_LOADED_EVENT);
		dispatch('onLoaded', adSlot);
		slotTweaker.setDataParam(adSlot, 'slotLoaded', true);
	}

	emitImpressionViewable(event: googletag.events.ImpressionViewableEvent, adSlot: AdSlot): void {
		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
		dispatch('onImpressionViewable', adSlot);
		slotTweaker.setDataParam(adSlot, 'slotViewed', true);
	}

	emitStatusChanged(adSlot: AdSlot): void {
		slotTweaker.setDataParam(adSlot, 'slotResult', adSlot.getStatus());
		dispatch('onStatusChanged', adSlot);
	}

	emitCustomEvent(event: null | string, adSlot: AdSlot): void {
		dispatch('onCustomEvent', adSlot, { status: event });
	}
}

export const slotListener = new SlotListener();
