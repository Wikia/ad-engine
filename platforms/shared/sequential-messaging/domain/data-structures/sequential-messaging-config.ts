export interface SequentialMessagingConfig {
	[sequentialAdId: string]: { length: number | string; targeting: Record<string, unknown> };
}
