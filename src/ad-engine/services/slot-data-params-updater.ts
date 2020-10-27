import { AdSlot } from '../models';
import { context } from './context-service';
import { slotTweaker } from './slot-tweaker';

/**
 * Sets dataset properties on AdSlot container for debug purposes.
 */
class SlotDataParamsUpdater {
	updateOnCreate(adSlot: AdSlot): void {
		slotTweaker.setDataParam(adSlot, 'gptPageParams', context.get('targeting'));
		slotTweaker.setDataParam(adSlot, 'gptSlotParams', adSlot.getTargeting());
	}

	updateOnRenderEnd(adSlot: AdSlot): void {
		slotTweaker.setDataParam(adSlot, 'gptAdvertiserId', adSlot.advertiserId);
		slotTweaker.setDataParam(adSlot, 'gptOrderId', adSlot.orderId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeId', adSlot.creativeId);
		slotTweaker.setDataParam(adSlot, 'gptLineItemId', adSlot.lineItemId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeSize', adSlot.creativeSize);
	}
}

export const slotDataParamsUpdater = new SlotDataParamsUpdater();
