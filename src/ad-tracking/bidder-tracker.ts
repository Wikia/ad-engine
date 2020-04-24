import { context, events, eventService, Middleware, MiddlewarePipeline } from '@ad-engine/core';
import { TrackingBidDefinition } from './tracking-bid';

export interface AdBidderContext {
	bid: TrackingBidDefinition;
	data: any;
}

class BidderTracker {
	private middlewareService = new MiddlewarePipeline<AdBidderContext>();

	add(middleware: Middleware<AdBidderContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.bidder');
	}

	register(callback: Middleware<AdBidderContext>): void {
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
