import { SequentialMessagingConfigStoreInterface } from '@wikia/ad-engine';
import { SequentialMessagingConfig } from './data-structures/sequential-messaging-config';
import { UserSequentialMessageState } from './data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStore } from './interfaces/user-sequential-message-state-store';
import { SequenceDetector } from './sequence-detector';

export class SequenceHandler {
	constructor(
		// TODO rename this to SequentialMessagingConfigStore, make an adapter, use ICBM underneath
		private instantConfig: SequentialMessagingConfigStoreInterface,
		private stateStore: UserSequentialMessageStateStore,
	) {}

	handleItem(sequentialAdId: string): void {
		// TODO replace instantConfig with an adapter SequentialMessagingConfigStore
		const sequentialMessagingConfig: SequentialMessagingConfig = this.instantConfig.get(
			'sequentialMessagingConfig',
		);

		// TODO move this validation to the SequentialMessagingConfigStore
		if (!this.validateSequentialMessagingConfigInput(sequentialMessagingConfig)) {
			return;
		}

		// TODO this can probably be replace with a method
		const sequenceDetector = new SequenceDetector(sequentialMessagingConfig);

		if (sequenceDetector.isAdSequential(sequentialAdId.toString())) {
			this.storeState(sequentialAdId, sequentialMessagingConfig);
		}
	}

	private validateSequentialMessagingConfigInput(
		sequentialMessagingConfig: SequentialMessagingConfig,
	): boolean {
		if (typeof sequentialMessagingConfig !== 'object') {
			return false;
		}

		for (const val of Object.values(sequentialMessagingConfig)) {
			if (typeof val !== 'object') return false;
			if (!('length' in val)) return false;
			if (typeof val.length !== 'string' && typeof val.length !== 'number') return false;
		}

		return true;
	}

	private storeState(
		sequentialAdId: string,
		sequentialMessagingConfig: SequentialMessagingConfig,
	): void {
		const state: UserSequentialMessageState = {};
		state[sequentialAdId] = { length: sequentialMessagingConfig[sequentialAdId].length as number };

		this.stateStore.set('sequential_messaging', state);
	}
}
