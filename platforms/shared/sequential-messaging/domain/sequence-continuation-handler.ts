import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';
import { TargetingManagerInterface } from './interfaces/targeting-manager.interface';

type AdConfig = { length: number | string; targeting: Record<string, unknown> };

export class SequenceContinuationHandler {
	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private userStateStore: UserSequentialMessageStateStoreInterface,
		private targetingManager: TargetingManagerInterface,
	) {}

	handleOngoingSequence(): boolean {
		const userState: UserSequentialMessageState = this.userStateStore.get();
		const fullConfig = this.configStore.get();

		if (userState == null || fullConfig == null) {
			return false;
		}

		for (const sequentialAdId of Object.keys(userState)) {
			const adConfig = fullConfig[sequentialAdId];

			this.setState(userState, sequentialAdId, adConfig);
			this.targetingManager.setTargeting(adConfig.targeting);
		}

		return true;
	}

	private setState(
		userState: UserSequentialMessageState,
		sequentialAdId: string,
		adConfig: AdConfig,
	) {
		const newUserState = userState;
		newUserState[sequentialAdId].step++;

		if (newUserState[sequentialAdId].step >= adConfig.length) {
			this.userStateStore.delete();
			return;
		}

		this.userStateStore.set(newUserState);
	}
}
