import { SequentialMessagingConfig } from '../data-structures/sequential-messaging-config';
import { Sequence } from '../data-structures/sequence';

export class NewSequenceDetector {
	sequentialAdsIds: string[] = [];

	constructor(sequentialMessagingConfig: SequentialMessagingConfig) {
		for (const item of Object.keys(sequentialMessagingConfig)) {
			this.sequentialAdsIds.push(item);
		}
	}

	isAdSequential(sequence: Sequence): boolean {
		return this.sequentialAdsIds.includes(sequence.id);
	}
}
