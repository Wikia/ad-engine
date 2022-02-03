import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { NewSequenceDetector } from './services/new-sequence-detector';
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
		const sequenceDetector = new NewSequenceDetector(this.config);

		return sequenceDetector.analyzeSequenceState(this.sequence);
	}

	private storeState(): void {
		const state: UserSequentialMessageState = {};
		state[this.sequence.id] = {};

		this.stateStore.set(state);
	}
}
