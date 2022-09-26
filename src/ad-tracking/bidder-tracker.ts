import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import { context, Dictionary } from '@ad-engine/core';
import { bidderTrackingCompiler } from './compilers/bidder-tracking-compiler';

export interface AdBidderContext {
	bid: TrackingBidDefinition;
	data: any;
}

class BidderTracker {
	isEnabled(): boolean {
		return context.get('options.tracking.slot.bidder');
	}

	register(callback: (data: Dictionary) => void): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.on(
			eventsRepository.BIDDERS_BIDS_RESPONSE,
			({ bidResponse }) => {
				const trackingData: AdBidderContext = {
					bid: bidResponse,
					data: {},
				};

				callback(bidderTrackingCompiler(trackingData));
			},
			false,
		);
	}
}

export const bidderTracker = new BidderTracker();
