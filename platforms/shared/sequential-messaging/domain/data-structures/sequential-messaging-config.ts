export interface SequentialMessagingConfig {
	[sequentialAdId: string]: {
		lastStepId: string;
		targeting: Record<string, unknown>;
	};
}
