import { communicationService } from '@ad-engine/communication';
import { AdSlot, context } from '@ad-engine/core';
import {
	slotTrackingCompiler,
	pageTrackingCompiler,
	slotPropertiesTrackingCompiler,
	slotBiddersTrackingCompiler,
} from './compilers';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';

class SlotTracker extends BaseTracker implements BaseTrackerInterface {
	onRenderEndedStatusToTrack = [
		AdSlot.STATUS_COLLAPSE,
		AdSlot.STATUS_FORCED_COLLAPSE,
		AdSlot.STATUS_MANUAL,
		AdSlot.STATUS_SUCCESS,
	];
	onChangeStatusToTrack = [
		AdSlot.STATUS_BLOCKED,
		AdSlot.STATUS_REQUESTED,
		AdSlot.STATUS_CLICKED,
		AdSlot.STATUS_ERROR,
		AdSlot.STATUS_VIEWPORT_CONFLICT,
		AdSlot.STATUS_HIVI_COLLAPSE,
		AdSlot.STATUS_CLOSED_BY_PORVATA,
		AdSlot.STATUS_CLOSED_BY_INTERSTITIAL,
		AdSlot.STATUS_HEAVY_AD_INTERVENTION,
		AdSlot.STATUS_UNKNOWN_INTERVENTION,
	];
	compilers = [slotPropertiesTrackingCompiler, slotTrackingCompiler, pageTrackingCompiler];

	isEnabled(): boolean {
		return context.get('options.tracking.slot.status');
	}

	register(callback, { bidders }): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.trackStatusAfterRendered = true;
		});

		communicationService.onSlotEvent(AdSlot.SLOT_STATUS_CHANGED, async ({ slot }) => {
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

		communicationService.onSlotEvent(AdSlot.CUSTOM_EVENT, async ({ slot, payload }) => {
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
