import { context } from '@wikia/ad-engine';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';

type adConfig = { length: number | string; targeting: Record<string, unknown> };

export class SequenceContinuationHandler {
	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private userStateStore: UserSequentialMessageStateStoreInterface,
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
			this.setTargeting(adConfig);
		}

		return true;
	}

	private setState(
		userState: UserSequentialMessageState,
		sequentialAdId: string,
		adConfig: adConfig,
	) {
		const newUserState = userState;
		newUserState[sequentialAdId].step++;

		if (newUserState[sequentialAdId].step >= adConfig.length) {
			this.userStateStore.delete();
			return;
		}

		this.userStateStore.set(newUserState);
	}

	private setTargeting(adConfig: adConfig) {
		for (const [tkey, tval] of Object.entries(adConfig.targeting)) {
			context.set('targeting.' + tkey, tval);
		}
	}
}
