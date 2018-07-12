import { logger, client } from '../utils';
import { AdSlot } from '../models';
import { context, slotTweaker, slotDataParamsUpdater } from '../services';

const logGroup = 'slot-listener';

let listeners = null;

function getIframe(adSlot) {
	return adSlot.getElement().querySelector('div[id*="_container_"] iframe');
}

function getAdType(event, adSlot) {
	const iframe = getIframe(adSlot);

	let isIframeAccessible = false;

	if (event.isEmpty) {
		return 'collapse';
	}

	try {
		isIframeAccessible = !!iframe.contentWindow.document.querySelector;
	} catch (e) {
		logger(logGroup, 'getAdType', 'iframe is not accessible');
	}

	if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
		return iframe.contentWindow.AdEngine_adType;
	}

	return 'success';
}

function getData(adSlot, { adType, event }) {
	const data = {
		browser: `${client.getOperatingSystem()} ${client.getBrowser()}`,
		adType: adType || '',
		status: adSlot.getStatus(),
		page_width: window.document.body.scrollWidth || '',
		time_bucket: (new Date()).getHours(),
		timestamp: new Date().getTime(),
		viewport_height: window.innerHeight || 0
	};

	if (event) {
		if (event.slot) {
			const response = event.slot.getResponseInformation();

			if (response) {
				data.creative_id = response.creativeId;
				data.line_item_id = response.lineItemId;
			}
		}

		if (event.size && event.size.length) {
			data.creative_size = event.size.join('x');
		}
	}

	return data;
}

function dispatch(methodName, adSlot, adInfo = {}) {
	if (!listeners) {
		listeners = context.get('listeners.slot').filter(listener => !listener.isEnabled || listener.isEnabled());
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
	emitRenderEnded(event, adSlot) {
		const adType = getAdType(event, adSlot);

		slotDataParamsUpdater.updateOnRenderEnd(adSlot, event);

		switch (adType) {
			case 'collapse':
				adSlot.collapse();
				break;
			default:
				adSlot.success();
				break;
		}

		dispatch('onRenderEnded', adSlot, { adType, event });
	}

	emitImpressionViewable(event, adSlot) {
		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
		dispatch('onImpressionViewable', adSlot, { event });
		slotTweaker.setDataParam(adSlot, 'slotViewed', true);
	}

	emitStatusChanged(adSlot) {
		slotTweaker.setDataParam(adSlot, 'slotResult', adSlot.getStatus());
		dispatch('onStatusChanged', adSlot);
	}
}

export const slotListener = new SlotListener();
