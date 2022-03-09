import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { TargetingManagerInterface } from './interfaces/targeting-manager.interface';

export class SequenceContinuationHandler {
	constructor(
		private userStateStore: UserSequentialMessageStateStoreInterface,
		private targetingManager: TargetingManagerInterface,
	) {}

	handleOngoingSequence(): void {
		const userState: UserSequentialMessageState = this.userStateStore.get();

		if (userState == null) {
			return;
		}

		for (const sequenceId of Object.keys(userState)) {
			userState[sequenceId].stepNo++;
			const sequenceState = userState[sequenceId];
			this.targetingManager.setTargeting(sequenceId, sequenceState);
			this.userStateStore.set(userState);
		}
	}
}
