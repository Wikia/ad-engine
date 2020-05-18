import { context, events, eventService, FuncPipeline, FuncPipelineStep } from '@ad-engine/core';
import { TrackingBidDefinition } from './tracking-bid';

export interface AdBidderContext {
	bid: TrackingBidDefinition;
	data: any;
}

class BidderTracker {
	private pipeline = new FuncPipeline<AdBidderContext>();

	add(...middlewares: FuncPipelineStep<AdBidderContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.bidder');
	}

	register(callback: FuncPipelineStep<AdBidderContext>): void {
		if (!this.isEnabled()) {
			return;
		}

		eventService.on(events.BIDS_RESPONSE, (bid: TrackingBidDefinition) => {
			this.pipeline.execute(
				{
					bid,
					data: {},
				},
				callback,
			);
		});
	}
}

export const bidderTracker = new BidderTracker();
