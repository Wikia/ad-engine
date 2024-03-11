import { communicationService } from '@ad-engine/communication';
import { BaseTracker, BaseTrackerInterface } from './base-tracker';
import { bidderTrackingCompiler } from './compilers';
import { BIDDERS_BIDS_RESPONSE } from "../communication/events/events-bidders";

class BidderTracker extends BaseTracker implements BaseTrackerInterface {
	compilers = [bidderTrackingCompiler];

	isEnabled(): boolean {
		return true;
	}

	register(callback): void {
		if (!this.isEnabled()) {
			return;
		}

		communicationService.on(
			BIDDERS_BIDS_RESPONSE,
			({ bidResponse }) => {
				callback(this.compileData(null, bidResponse));
			},
			false,
		);
	}
}

export const bidderTracker = new BidderTracker();
