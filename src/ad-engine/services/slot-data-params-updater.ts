import { GptSizeMap } from '../providers';
import { context } from './context-service';
import { slotTweaker } from './slot-tweaker';

/**
 * Sets dataset properties on AdSlot container for debug purposes.
 */
class SlotDataParamsUpdater {
	updateOnCreate(adSlot, targeting) {
		const sizes = adSlot.isOutOfPage()
			? 'out-of-page'
			: new GptSizeMap(adSlot.getSizes()).toString();

		slotTweaker.setDataParam(adSlot, 'gptPageParams', context.get('targeting'));
		slotTweaker.setDataParam(adSlot, 'gptSlotParams', targeting);
		slotTweaker.setDataParam(adSlot, 'sizes', sizes);
	}

	updateOnRenderEnd(adSlot) {
		slotTweaker.setDataParam(adSlot, 'gptOrderId', adSlot.orderId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeId', adSlot.creativeId);
		slotTweaker.setDataParam(adSlot, 'gptLineItemId', adSlot.lineItemId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeSize', adSlot.creativeSize);
	}
}

export const slotDataParamsUpdater = new SlotDataParamsUpdater();
