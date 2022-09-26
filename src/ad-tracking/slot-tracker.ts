import { communicationService } from '@ad-engine/communication';
import { AdSlot, context, Dictionary } from '@ad-engine/core';
import { slotTrackingCompiler } from './compilers/slot-tracking-compiler';
import { slotPropertiesTrackingCompiler } from './compilers/slot-properties-tracking-compiler';
import { slotBiddersTrackingCompiler } from './compilers/slot-bidders-tracking-compiler';

export interface AdInfoContext {
	data: any;
	slot: AdSlot;
}

class SlotTracker {
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

	isEnabled(): boolean {
		return context.get('options.tracking.slot.status');
	}

	register(callback: (data: Dictionary) => void, bidders): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.trackStatusAfterRendered = true;
		});

		communicationService.onSlotEvent(AdSlot.SLOT_STATUS_CHANGED, async ({ slot }) => {
			const status = slot.getStatus();
			const trackingData: AdInfoContext = {
				slot,
				data: {},
			};

			if (slot.trackStatusAfterRendered) {
				delete slot.trackStatusAfterRendered;
				if (
					this.onRenderEndedStatusToTrack.includes(status) ||
					slot.getConfigProperty('trackEachStatus')
				) {
					callback(
						await slotBiddersTrackingCompiler(
							slotPropertiesTrackingCompiler(slotTrackingCompiler(trackingData)),
							bidders,
						),
					);
					return;
				}
			}

			if (
				this.onChangeStatusToTrack.includes(status) ||
				slot.getConfigProperty('trackEachStatus')
			) {
				callback(
					await slotBiddersTrackingCompiler(
						slotPropertiesTrackingCompiler(slotTrackingCompiler(trackingData)),
						bidders,
					),
				);
			}
		});

		communicationService.onSlotEvent(AdSlot.CUSTOM_EVENT, async ({ slot, payload }) => {
			const trackingData: AdInfoContext = {
				slot,
				data: {
					ad_status: payload?.status,
				},
			};

			callback(
				await slotBiddersTrackingCompiler(
					slotPropertiesTrackingCompiler(slotTrackingCompiler(trackingData)),
					bidders,
				),
			);
		});
	}
}

export const slotTracker = new SlotTracker();
