export interface SequentialMessagingConfig {
	[sequentialAdId: string]: {
		lastStepId: number | string;
		length: number | string;
		targeting: Record<string, unknown>;
	};
}
