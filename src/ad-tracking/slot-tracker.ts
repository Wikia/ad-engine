import { communicationService } from '@ad-engine/communication';
import { AdSlot, context, FuncPipeline, FuncPipelineStep } from '@ad-engine/core';

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
		AdSlot.STATUS_CLICKED,
		AdSlot.STATUS_REQUESTED,
		AdSlot.STATUS_ERROR,
		AdSlot.STATUS_VIEWPORT_CONFLICT,
		AdSlot.STATUS_HIVI_COLLAPSE,
		AdSlot.STATUS_CLOSED_BY_PORVATA,
		AdSlot.STATUS_CLOSED_BY_INTERSTITIAL,
		AdSlot.STATUS_HEAVY_AD_INTERVENTION,
		AdSlot.STATUS_UNKNOWN_INTERVENTION,
	];

	private pipeline = new FuncPipeline<AdInfoContext>();

	add(...middlewares: FuncPipelineStep<AdInfoContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.status');
	}

	register(callback: FuncPipelineStep<AdInfoContext>): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			slot.trackStatusAfterRendered = true;
		});

		communicationService.onSlotEvent(AdSlot.SLOT_STATUS_CHANGED, ({ slot }) => {
			const status = slot.getStatus();
			const middlewareContext: AdInfoContext = {
				slot,
				data: {},
			};

			if (slot.trackStatusAfterRendered) {
				delete slot.trackStatusAfterRendered;
				if (
					this.onRenderEndedStatusToTrack.includes(status) ||
					slot.getConfigProperty('trackEachStatus')
				) {
					this.pipeline.execute(middlewareContext, callback);
					return;
				}
			}

			if (
				this.onChangeStatusToTrack.includes(status) ||
				slot.getConfigProperty('trackEachStatus')
			) {
				this.pipeline.execute(middlewareContext, callback);
			}
		});

		communicationService.onSlotEvent(AdSlot.CUSTOM_EVENT, ({ slot, payload }) => {
			const middlewareContext: AdInfoContext = {
				slot,
				data: {
					ad_status: payload?.status,
				},
			};

			this.pipeline.execute(middlewareContext, callback);
		});
	}
}

export const slotTracker = new SlotTracker();
