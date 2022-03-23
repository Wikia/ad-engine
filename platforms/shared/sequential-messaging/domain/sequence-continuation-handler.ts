import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { TargetingManagerInterface } from './interfaces/targeting-manager.interface';

export class SequenceContinuationHandler {
	constructor(
		private userStateStore: UserSequentialMessageStateStoreInterface,
		private targetingManager: TargetingManagerInterface,
		private onIntermediateStepLoad: (storeState: (loadedStep: number) => void) => void,
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
			this.onIntermediateStepLoad((loadedStep: number) => {
				// TODO SM this can be pulled out of domain
				//  when userStateStore will be able to update each sequence independently
				// TODO SM 2 attempts counter can be added for extra safety
				if (loadedStep !== userState[sequenceId].stepNo) {
					console.log('[SM] Invalid step loaded by the Provider!');
					return;
				}

				this.userStateStore.set(userState);
			});
		}
	}
}
