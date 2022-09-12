import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { StorageStrategies, StorageStrategyInterface } from './storage-strategies';
import { localStorageStrategy } from './local-strategy';
import { admsStorageService } from './adms-strategy';

export class UserIdentity extends BaseServiceSetup {
	private getPPID(strategy: StorageStrategies): StorageStrategyInterface {
		utils.logger('DJ', strategy);
		switch (strategy) {
			case StorageStrategies.ADMS:
				return admsStorageService;
			case StorageStrategies.LOCAL:
			default:
				return localStorageStrategy;
		}
	}

	async setupPPID(strategy: StorageStrategies): Promise<void> {
		context.set('targeting.ppid', await this.getPPID(strategy).get());
	}

	async call(): Promise<void> {
		const ppid = context.get('services.ppid');
		if (ppid.enabled) {
			await this.setupPPID(ppid.strategy);
		}
	}
}

export const userIdentity = new UserIdentity();
