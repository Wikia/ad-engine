import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';

export class SequenceStartHandler {
	constructor(private stateStore: UserSequentialMessageStateStoreInterface) {}

	startSequence(sequenceId: string, width: number, height: number): void {
		// [Multi SM] To run multiple sequences in parallel we will have to extend this to first check for existing SM cookie
		// and add the sequence to that cookie if exists
		const state: UserSequentialMessageState = {};
		state[sequenceId] = { stepNo: 1, width: width, height: height };

		this.stateStore.set(state);
	}
}
