import { context, messageBus, utils } from '@ad-engine/core';

export enum TrackingTarget {
	DataWarehouse = 'DW',
	GoogleAnalytics = 'GA',
}

export interface TrackingPayload {
	target: TrackingTarget;
	payload: any;
}

/**
 * Monitor messages sent with post message.
 * Message must abide the TrackingPayload interface.
 *
 * For example use, check examples /tracking/postmessage-tracker/.
 */
class PostmessageTrackingTracker {
	// TODO: Add TrackingFilter middleware!
	register(callback: utils.Middleware<TrackingPayload>) {
		if (!this.isEnabled()) {
			return;
		}
		// idempotent so can be called multiple times
		messageBus.register<TrackingPayload>(
			{ keys: ['payload', 'target'], infinite: true },
			(message) => {
				if (!this.isTrackingMessage(message)) {
					return;
				}

				callback({
					target: message.target,
					payload: message.payload,
				});
			},
		);
	}

	private isTrackingMessage(message: TrackingPayload): boolean {
		return Object.values(TrackingTarget).includes(message.target);
	}

	isEnabled(): boolean {
		return !!context.get('options.tracking.postmessage');
	}
}

export const postmessageTrackingTracker = new PostmessageTrackingTracker();
