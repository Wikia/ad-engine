import { context, events, eventService, FuncPipeline, FuncPipelineStep } from '@ad-engine/core';
import { TrackingBidDefinition } from './tracking-bid';

export interface AdBidderContext {
	bid: TrackingBidDefinition;
	data: any;
}

class BidderTracker {
	private middlewareService = new FuncPipeline<AdBidderContext>();

	add(middleware: FuncPipelineStep<AdBidderContext>): this {
		this.middlewareService.add(middleware);

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
			this.middlewareService.execute(
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
