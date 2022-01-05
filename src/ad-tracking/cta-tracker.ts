import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService } from '@ad-engine/core';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
	};
}

class CtaTracker {
	private pipeline = new FuncPipeline<AdClickContext>();

	add(...middlewares: FuncPipelineStep<AdClickContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	register(callback: FuncPipelineStep<AdClickContext>): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_MESSAGE_BOX_EVENT,
			({ adSlotName, ad_status }) => {
				this.handleCtaTracking(callback, slotService.get(adSlotName), ad_status);
			},
			false,
		);
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
