import { communicationService } from '@ad-engine/communication';
import { AdSlot, context } from '@ad-engine/core';
import { viewabilityTrackingCompiler, viewabilityPropertiesTrackingCompiler } from './compilers';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';

class ViewabilityTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [viewabilityTrackingCompiler, viewabilityPropertiesTrackingCompiler];

	isEnabled(): boolean {
		return context.get('options.tracking.slot.viewability');
	}

	register(callback): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) => {
			callback(this.compileData(slot));
		});
	}
}

export const viewabilityTracker = new ViewabilityTracker();
