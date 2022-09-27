import { communicationService, eventsRepository } from '@ad-engine/communication';
import { slotService } from '@ad-engine/core';
import { slotTrackingCompiler } from './compilers';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';

class CtaTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [slotTrackingCompiler];

	isEnabled = () => true;

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
