// @ts-strict-ignore
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { slotService } from '@ad-engine/core';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import { slotTrackingCompiler } from './compilers';

class CtaTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [slotTrackingCompiler];

	register(callback): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_MESSAGE_BOX_EVENT,
			({ adSlotName, ad_status }) => {
				callback(this.compileData(slotService.get(adSlotName), null, { ad_status }));
			},
			false,
		);
	}
}

export const ctaTracker = new CtaTracker();
