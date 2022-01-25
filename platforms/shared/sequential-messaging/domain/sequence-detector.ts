import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';

export class SequenceDetector {
	sequentialAdsIds: string[] = [];

	constructor(sequentialMessagingConfig: SequentialMessagingConfig) {
		for (const item of Object.keys(sequentialMessagingConfig)) {
			this.sequentialAdsIds.push(item);
		}
	}

	isAdSequential(sequentialAdId: string): boolean {
		return this.sequentialAdsIds.includes(sequentialAdId);
	}
}
