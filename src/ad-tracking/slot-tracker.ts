import { communicationService } from '@ad-engine/communication';
import { AdSlotEvent, AdSlotStatus } from '@ad-engine/core';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import {
	pageTrackingCompiler,
	slotBiddersTrackingCompiler,
	slotPropertiesTrackingCompiler,
	slotTrackingCompiler,
} from './compilers';

class SlotTracker extends BaseTracker implements BaseTrackerInterface {
	onRenderEndedStatusToTrack: string[] = [
		AdSlotStatus.STATUS_COLLAPSE,
		AdSlotStatus.STATUS_FORCED_COLLAPSE,
		AdSlotStatus.STATUS_MANUAL,
		AdSlotStatus.STATUS_SUCCESS,
	];
	onChangeStatusToTrack: string[] = [
		AdSlotStatus.STATUS_BLOCKED,
		AdSlotStatus.STATUS_REQUESTED,
		AdSlotStatus.STATUS_CLICKED,
		AdSlotStatus.STATUS_ERROR,
		AdSlotStatus.STATUS_VIEWPORT_CONFLICT,
		AdSlotStatus.STATUS_HIVI_COLLAPSE,
		AdSlotStatus.STATUS_HEAVY_AD_INTERVENTION,
		AdSlotStatus.STATUS_UNKNOWN_INTERVENTION,
	];
	compilers = [slotPropertiesTrackingCompiler, slotTrackingCompiler, pageTrackingCompiler];

	isEnabled(): boolean {
		return true;
	}

	register(callback, { bidders }): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.trackStatusAfterRendered = true;
		});

		communicationService.onSlotEvent(AdSlotEvent.SLOT_STATUS_CHANGED, async ({ slot }) => {
			const status = slot.getStatus();

			if (slot.trackStatusAfterRendered) {
				delete slot.trackStatusAfterRendered;

				if (
					this.onRenderEndedStatusToTrack.includes(status) ||
					slot.getConfigProperty('trackEachStatus')
				) {
					callback(await slotBiddersTrackingCompiler(this.compileData(slot), bidders));
					return;
				}
			}

			if (
				this.onChangeStatusToTrack.includes(status) ||
				slot.getConfigProperty('trackEachStatus')
			) {
				callback(await slotBiddersTrackingCompiler(this.compileData(slot), bidders));
			}
		});

		communicationService.onSlotEvent(AdSlotEvent.CUSTOM_EVENT, async ({ slot, payload }) => {
			callback(
				await slotBiddersTrackingCompiler(
					this.compileData(slot, null, { ad_status: payload?.status }),
					bidders,
				),
			);
		});
	}
}

export const slotTracker = new SlotTracker();
