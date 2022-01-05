import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import { context, FuncPipeline, FuncPipelineStep } from '@ad-engine/core';

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

		communicationService.on(
			eventsRepository.BIDDERS_BIDS_RESPONSE,
			({ bidResponse }) => {
				this.pipeline.execute(
					{
						bid: bidResponse,
						data: {},
					},
					callback,
				);
			},
			false,
		);
	}
}

export const bidderTracker = new BidderTracker();
