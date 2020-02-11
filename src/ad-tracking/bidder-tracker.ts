import { context, events, eventService, utils } from '@ad-engine/core';

export interface AdBidderContext {
	bid: PrebidBidResponse;
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

		eventService.on(events.BIDS_RESPONSE, (bid: PrebidBidResponse) => {
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
