import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, Dictionary, slotService } from '@ad-engine/core';
import { slotTrackingCompiler } from './compilers/slot-tracking-compiler';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
	};
}

class CtaTracker {
	register(callback: (data: Dictionary) => void): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_MESSAGE_BOX_EVENT,
			({ adSlotName, ad_status }) => {
				const trackingData: AdClickContext = {
					slot: slotService.get(adSlotName),
					data: {
						ad_status,
					},
				};

				callback(slotTrackingCompiler(trackingData));
			},
			false,
		);
	}
}

export const ctaTracker = new CtaTracker();
