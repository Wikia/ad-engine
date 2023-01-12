import { AdSlot } from '../models';
import { slotTweaker } from './slot-tweaker';
import { targetingService } from './targeting-service';

function logRenderedAd(adSlot: AdSlot) {
	const isTlb = adSlot.getSlotName() == 'top_leaderboard';
	const smLoggerLoaded =
		window['smTracking'] !== undefined &&
		typeof window['smTracking'].recordRenderedAd === 'function';

	if (isTlb && smLoggerLoaded) {
		window['smTracking'].recordRenderedAd(adSlot);
	}

	// Loggers existence serves as a flag weather or not a sequence is in progress
	// We need to remove it not to log TLBs reloaded by DurationMedia
	delete window['smTracking'];
}

/**
 * Sets dataset properties on AdSlot container for debug purposes.
 */
class SlotDataParamsUpdater {
	updateOnCreate(adSlot: AdSlot): void {
		slotTweaker.setDataParam(adSlot, 'gptPageParams', targetingService.dump());
		slotTweaker.setDataParam(adSlot, 'gptSlotParams', adSlot.getTargeting());
	}

	updateOnRenderEnd(adSlot: AdSlot): void {
		logRenderedAd(adSlot);

		slotTweaker.setDataParam(adSlot, 'gptAdvertiserId', adSlot.advertiserId);
		slotTweaker.setDataParam(adSlot, 'gptOrderId', adSlot.orderId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeId', adSlot.creativeId);
		slotTweaker.setDataParam(adSlot, 'gptLineItemId', adSlot.lineItemId);
		slotTweaker.setDataParam(adSlot, 'gptCreativeSize', adSlot.creativeSize);
	}
}

export const slotDataParamsUpdater = new SlotDataParamsUpdater();
