import { context, events, eventService, utils } from '@ad-engine/core';
import { TrackingBidDefinition } from './tracking-bid';

export interface AdBidderContext {
	bid: TrackingBidDefinition;
	data: any;
}

class BidderTracker {
	private middlewareService = new utils.MiddlewareService<AdBidderContext>();

	add(middleware: utils.Middleware<AdBidderContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.bidder');
	}

	register(callback: utils.Middleware<AdBidderContext>): void {
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
