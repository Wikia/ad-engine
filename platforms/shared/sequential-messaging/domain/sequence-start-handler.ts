import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { NewSequenceDetector } from './services/new-sequence-detector';

export class SequenceStartHandler {
	private config: SequentialMessagingConfig;

	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private stateStore: UserSequentialMessageStateStoreInterface,
	) {}

	handleItem(sequentialAdId: string): void {
		if (this.isAdSequential(sequentialAdId)) {
			this.storeState(sequentialAdId);
		}
	}

	private isAdSequential(sequentialAdId: string): boolean {
		this.config = this.configStore.get();
		if (this.config == null) {
			return false;
		}
		const sequenceDetector = new NewSequenceDetector(this.config);

		return sequenceDetector.isAdSequential(sequentialAdId.toString());
	}

	private storeState(sequentialAdId: string): void {
		const state: UserSequentialMessageState = {};
		state[sequentialAdId] = {
			length: this.config[sequentialAdId].length as number,
			targeting: this.config[sequentialAdId].targeting,
		};

		this.stateStore.set(state);
	}
}
