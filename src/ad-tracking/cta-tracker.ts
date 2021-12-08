import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService } from '@ad-engine/core';
import { props } from 'ts-action';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
	};
}

export const messageBoxTrackingEvent = globalAction(
	'[AdEngine] MessageBox event',
	props<{ adSlotName: string; ad_status: string }>(),
);

class CtaTracker {
	private pipeline = new FuncPipeline<AdClickContext>();

	add(...middlewares: FuncPipelineStep<AdClickContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	register(callback: FuncPipelineStep<AdClickContext>): void {
		communicationService.action$
			.pipe(ofType(messageBoxTrackingEvent))
			.subscribe(async ({ adSlotName, ad_status }) => {
				this.handleCtaTracking(callback, slotService.get(adSlotName), ad_status);
			});
	}

	private handleCtaTracking(
		callback: FuncPipelineStep<AdClickContext>,
		slot: AdSlot,
		ad_status: string,
	): void {
		const data = {
			ad_status,
		};
		this.pipeline.execute(
			{
				slot,
				data,
			},
			callback,
		);
	}
}

export const ctaTracker = new CtaTracker();
