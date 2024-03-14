import { Dictionary, FuncPipeline, FuncPipelineStep, messageBus } from '@ad-engine/core';

export const TrackingTarget = {
	DataWarehouse: 'DW',
	GoogleAnalytics: 'GA',
};

export interface DataWarehouseMessage {
	target: string;
	payload: Dictionary<string | number>;
}

export interface GoogleAnalyticsMessage {
	target: string;
	payload: GoogleAnalyticsPayload;
}

export interface GoogleAnalyticsPayload {
	category: string;
	action: string;
	label: string;
	value: string | number;
}

export type TrackingMessage = GoogleAnalyticsMessage & DataWarehouseMessage;

export const trackingPayloadValidationStep: FuncPipelineStep<TrackingMessage> = (
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
 */
export class PostmessageTracker {
	private pipeline = new FuncPipeline<any>();

	constructor(private readonly requiredKeys: string[]) {
		this.pipeline.add(trackingPayloadValidationStep);
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
		return true;
	}
}
