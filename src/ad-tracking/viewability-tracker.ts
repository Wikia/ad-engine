import { communicationService } from '@ad-engine/communication';
import { AdSlot, context, Dictionary } from '@ad-engine/core';
import { viewabilityTrackingCompiler } from './compilers/viewability-tracking-compiler';
import { viewabilityPropertiesTrackingCompiler } from './compilers/viewability-properties-tracking-compiler';

export interface AdViewabilityContext {
	data: any;
	slot: AdSlot;
}

class ViewabilityTracker {
	isEnabled(): boolean {
		return context.get('options.tracking.slot.viewability');
	}

	register(callback: (data: Dictionary) => void): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) => {
			const trackingData: AdViewabilityContext = {
				slot,
				data: {},
			};

			callback(viewabilityTrackingCompiler(viewabilityPropertiesTrackingCompiler(trackingData)));
		});
	}
}

export const viewabilityTracker = new ViewabilityTracker();
