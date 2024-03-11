import { communicationService } from '@ad-engine/communication';
import { slotService } from '@ad-engine/core';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import { slotTrackingCompiler } from './compilers';
import { AD_ENGINE_MESSAGE_BOX_EVENT } from "../communication/events/events-ad-engine";

class CtaTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [slotTrackingCompiler];

	register(callback): void {
		communicationService.on(
			AD_ENGINE_MESSAGE_BOX_EVENT,
			({ adSlotName, ad_status }) => {
				callback(this.compileData(slotService.get(adSlotName), null, { ad_status }));
			},
			false,
		);
	}
}

export const ctaTracker = new CtaTracker();
