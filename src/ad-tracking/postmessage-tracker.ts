import { context, Dictionary, messageBus, Middleware, MiddlewarePipeline } from '@ad-engine/core';

export enum TrackingTarget {
	DataWarehouse = 'DW',
	GoogleAnalytics = 'GA',
}

export interface DataWarehouseMessage {
	target: TrackingTarget.DataWarehouse;
	payload: Dictionary<string | number>;
}

export interface GoogleAnalyticsMessage {
	target: TrackingTarget.GoogleAnalytics;
	payload: GoogleAnalyticsPayload;
}

export interface GoogleAnalyticsPayload {
	category: string;
	action: string;
	label: string;
	value: string | number;
}

export type TrackingMessage = GoogleAnalyticsMessage & DataWarehouseMessage;

export const trackingPayloadValidationMiddleware: Middleware<TrackingMessage> = (
	message: Partial<TrackingMessage>,
	next,
) => {
	if (Object.values(TrackingTarget).includes(message.target) && message.payload) {
		next({
			payload: message.payload,
			target: message.target,
		});
	}
};

/**
 * Monitor messages sent with post message.
 * Message must abide the TrackingMessage interface.
 *
 * For example use, check examples /tracking/postmessage-tracker/.
 */
export class PostmessageTracker {
	private middlewareService = new MiddlewarePipeline<any>();

	constructor(private readonly requiredKeys: string[]) {}

	add(middleware: Middleware<any>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	register<T>(callback: Middleware<T>): this {
		if (!this.isEnabled()) {
			return;
		}
		messageBus.register<T>({ keys: this.requiredKeys, infinite: true }, (message) => {
			this.middlewareService.execute({ ...message }, callback);
		});

		return this;
	}

	private isEnabled(): boolean {
		return !!context.get('options.tracking.postmessage');
	}
}
