import { communicationService } from '@ad-engine/communication';
import { AdSlotEvent } from '@ad-engine/core';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import { viewabilityPropertiesTrackingCompiler, viewabilityTrackingCompiler } from './compilers';

class ViewabilityTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [viewabilityTrackingCompiler, viewabilityPropertiesTrackingCompiler];

	isEnabled(): boolean {
		return true;
	}

	register(callback): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlotEvent.SLOT_VIEWED_EVENT, ({ slot }) => {
			callback(this.compileData(slot));
		});
	}
}

export const viewabilityTracker = new ViewabilityTracker();
