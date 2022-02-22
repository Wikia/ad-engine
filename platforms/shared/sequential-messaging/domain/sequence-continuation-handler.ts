import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { TargetingManagerInterface } from './interfaces/targeting-manager.interface';
import { SequenceEndStateHandler } from './services/sequence-end-state-handler';

import { context } from '@wikia/ad-engine';

export class SequenceContinuationHandler {
	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private userStateStore: UserSequentialMessageStateStoreInterface,
		private targetingManager: TargetingManagerInterface,
		private onSlotShowedEvent: (onEvent: SequenceEndStateHandler) => void,
	) {}

	handleOngoingSequence(): boolean {
		const userState: UserSequentialMessageState = this.userStateStore.get();
		const fullConfig = this.configStore.get();

		if (userState == null || fullConfig == null) {
			return false;
		}

		for (const sequentialAdId of Object.keys(userState)) {
			const adConfig = fullConfig[sequentialAdId];

			this.targetingManager.setTargeting(adConfig.targeting);

			this.onSlotShowedEvent(
				new SequenceEndStateHandler(this.userStateStore, adConfig.lastStepId.toString()),
			);
		}
		console.log('HERE TARGETING');
		console.log(context.get('targeting'));

		return true;
	}
}
