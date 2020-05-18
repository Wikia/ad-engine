import { AdSlot, context, eventService, FuncPipeline, FuncPipelineStep } from '@ad-engine/core';

export interface AdViewabilityContext {
	data: any;
	slot: AdSlot;
}

class ViewabilityTracker {
	private pipeline = new FuncPipeline<AdViewabilityContext>();

	add(...middlewares: FuncPipelineStep<AdViewabilityContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.viewability');
	}

	register(callback: FuncPipelineStep<AdViewabilityContext>): void {
		if (!this.isEnabled()) {
			return;
		}

		eventService.on(AdSlot.SLOT_VIEWED_EVENT, (slot: AdSlot) => {
			this.pipeline.execute(
				{
					slot,
					data: {},
				},
				callback,
			);
		});
	}
}

export const viewabilityTracker = new ViewabilityTracker();
