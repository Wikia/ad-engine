import { context, Dictionary, FuncPipeline, FuncPipelineStep, messageBus } from '@ad-engine/core';

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

export const trackingPayloadValidationMiddleware: FuncPipelineStep<TrackingMessage> = (
	message: Partial<TrackingMessage>,
	next,
) => {
	if (Object.values(TrackingTarget).includes(message.target) && message.payload) {
		return next({
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
	private pipeline = new FuncPipeline<any>();

	constructor(private readonly requiredKeys: string[]) {}

	add(middleware: FuncPipelineStep<any>): this {
		this.pipeline.add(middleware);

		return this;
	}

	register<T>(callback: FuncPipelineStep<T>, origin?: string[]): this {
		if (!this.isEnabled()) {
			return;
		}
		messageBus.register<T>({ origin, keys: this.requiredKeys, infinite: true }, (message) => {
			this.pipeline.execute({ ...message }, callback);
		});

		return this;
	}

	private isEnabled(): boolean {
		return !!context.get('options.tracking.postmessage');
	}
}
