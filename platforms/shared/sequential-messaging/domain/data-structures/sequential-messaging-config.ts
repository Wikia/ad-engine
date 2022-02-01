export interface SequentialMessagingConfig {
	[sequentialAdId: string]: {
		lastStepId: number | string;
		targeting: Record<string, unknown>;
	};
}
