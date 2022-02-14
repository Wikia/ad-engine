import { Sequence } from '../data-structures/sequence';
import { UserSequentialMessageStateStoreInterface } from '../interfaces/user-sequential-message-state-store.interface';
import { SequenceStateHandlerInterface } from './sequence-state-handlers/sequence-state-handler-interface';

export class SequenceEndStateHandler implements SequenceStateHandlerInterface {
	constructor(
		private userStateStore: UserSequentialMessageStateStoreInterface,
		private lastStepId: string,
	) {}

	handleState(sequence: Sequence) {
		if (this.lastStepId == sequence.stepId) {
			this.userStateStore.delete();
		}
	}
}
