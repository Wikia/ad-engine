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
	private middlewareService = new utils.MiddlewareService<any>();

	register(callback: utils.Middleware<TrackingPayload>) {
		if (!this.isEnabled()) {
			return;
		}

		messageBus.register<TrackingPayload>(
			{ keys: ['payload', 'target'], infinite: true },
			(message) => {

				if (!this.isTrackingMessage(message)) {
					return;
				}

				this.middlewareService.execute(
					{
						target: message.target,
						payload: message.payload,
					},
					callback,
				);
		});
	}

	private isTrackingMessage(message: TrackingPayload): boolean {
		return Object.values(TrackingTarget).includes(message.target);
	}

	isEnabled(): boolean {
		return !!context.get('options.tracking.postmessage');
	}
}

export const postmessageTrackingTracker = new PostmessageTrackingTracker();
