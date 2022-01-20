import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { UserSequentialMessageStateStore } from './interfaces/user-sequential-message-state-store';
import { SequenceDetector } from './sequence-detector';

export class SequenceHandler {
	constructor(
		private sequentialMessagingConfigStore: SequentialMessagingConfigStoreInterface,
		private stateStore: UserSequentialMessageStateStore,
	) {}

	handleItem(sequentialAdId: string): void {
		const sequentialMessagingConfig: SequentialMessagingConfig = this.sequentialMessagingConfigStore.get();

		if (sequentialMessagingConfig == null) {
			return;
		}

		// TODO this can probably be replace with a method
		const sequenceDetector = new SequenceDetector(sequentialMessagingConfig);

		if (sequenceDetector.isAdSequential(sequentialAdId.toString())) {
			this.storeState(sequentialAdId, sequentialMessagingConfig);
		}
	}

	private storeState(
		sequentialAdId: string,
		sequentialMessagingConfig: SequentialMessagingConfig,
	): void {
		const state: UserSequentialMessageState = {};
		state[sequentialAdId] = { length: sequentialMessagingConfig[sequentialAdId].length as number };

		this.stateStore.set('sequential_messaging', state);
	}
}
