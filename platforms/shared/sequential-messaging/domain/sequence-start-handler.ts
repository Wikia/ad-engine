import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { NewSequenceStateHandler } from './services/new-sequence-state-handler';
import { Sequence } from './data-structures/sequence';

export class SequenceStartHandler {
	private config: SequentialMessagingConfig;
	private sequence: Sequence;

	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private stateStore: UserSequentialMessageStateStoreInterface,
	) {}

	handleSequence(sequence: Sequence): void {
		this.config = this.configStore.get();
		this.sequence = sequence;
		if (this.config == null) {
			return;
		}

		if (this.isAdSequential()) {
			this.storeState();
		}
	}

	private isAdSequential(): boolean {
		const sequenceDetector = new NewSequenceStateHandler(this.config);

		return sequenceDetector.handleState(this.sequence);
	}

	private storeState(): void {
		const state: UserSequentialMessageState = {};
		state[this.sequence.id] = { lastStepId: this.config[this.sequence.id].lastStepId };

		this.stateStore.set(state);
	}
}
