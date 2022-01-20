import { InstantConfigServiceInterface } from '@wikia/ad-engine';
import { SequentialMessagingConfig } from '../domain/data-structures/sequential-messaging-config';
import { SequentialMessagingConfigStoreInterface } from '../domain/interfaces/sequential-messaging-config-store.interface';

export class SequentialMessagingConfigStore implements SequentialMessagingConfigStoreInterface {
	constructor(private instantConfig: InstantConfigServiceInterface) {}

	get(): SequentialMessagingConfig {
		const sequentialMessagingConfig: SequentialMessagingConfig = this.instantConfig.get(
			'icSequentialMessaging',
		);

		if (!this.validateSequentialMessagingConfigInput(sequentialMessagingConfig)) {
			return null;
		}

		return sequentialMessagingConfig;
	}

	private validateSequentialMessagingConfigInput(
		sequentialMessagingConfig: SequentialMessagingConfig,
	): boolean {
		if (
			typeof sequentialMessagingConfig !== 'object' ||
			sequentialMessagingConfig instanceof Array ||
			Object.keys(sequentialMessagingConfig).length === 0
		) {
			return false;
		}

		for (const val of Object.values(sequentialMessagingConfig)) {
			if (typeof val !== 'object') return false;
			if (!('length' in val)) return false;
			if (typeof val.length !== 'string' && typeof val.length !== 'number') return false;
		}

		return true;
	}
}
