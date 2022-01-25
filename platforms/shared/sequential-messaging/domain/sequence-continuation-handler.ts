import { context } from '@wikia/ad-engine';
import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { SequentialMessagingConfigStoreInterface } from './interfaces/sequential-messaging-config-store.interface';

export class SequenceContinuationHandler {
	constructor(
		private configStore: SequentialMessagingConfigStoreInterface,
		private userStateStore: UserSequentialMessageStateStoreInterface,
	) {}

	handleOngoingSequence(): boolean {
		const userStateCookie: UserSequentialMessageState = this.userStateStore.get();
		const fullConfig = this.configStore.get();

		if (userStateCookie == null) {
			return false;
		}

		for (const sequentialAd of Object.values(userStateCookie)) {
			const adConfig = fullConfig[sequentialAd];
			for (const [tkey, tval] of Object.entries(adConfig.targeting)) {
				context.set('targeting.' + tkey, tval);
			}
		}

		console.log('HERE TARGETING in handleOngoingSequence');
		console.log(context.get('targeting'));

		return true;
	}
}
