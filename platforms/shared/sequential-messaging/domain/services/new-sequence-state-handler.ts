import { SequentialMessagingConfig } from '../data-structures/sequential-messaging-config';
import { SequenceStateHandlerInterface } from './sequence-state-handlers/sequence-state-handler-interface';
import { Sequence } from '../data-structures/sequence';

export class NewSequenceStateHandler implements SequenceStateHandlerInterface {
	sequentialAdsIds: string[] = [];

	constructor(sequentialMessagingConfig: SequentialMessagingConfig) {
		for (const item of Object.keys(sequentialMessagingConfig)) {
			this.sequentialAdsIds.push(item);
		}
	}

	handleState(sequence: Sequence): boolean {
		return this.sequentialAdsIds.includes(sequence.id);
	}
}
