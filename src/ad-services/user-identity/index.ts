import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { StorageStrategies, StorageStrategyInterface } from './storage-strategies';
import { localStorageStrategy } from './local-strategy';
import { admsStorageService } from './adms-strategy';

export class UserIdentity extends BaseServiceSetup {
	public static logGroup = 'user-identity';

	private getPPID(strategy: StorageStrategies): StorageStrategyInterface {
		utils.logger(UserIdentity.logGroup, 'active strategy: ', strategy);
		switch (strategy) {
			case StorageStrategies.ADMS:
				return admsStorageService;
			case StorageStrategies.LOCAL:
			default:
				return localStorageStrategy;
		}
	}

	async setupPPID(strategy: StorageStrategies): Promise<void> {
		try {
			context.set('targeting.ppid', await this.getPPID(strategy).get());
		} catch (e) {
			utils.logger(UserIdentity.logGroup, 'Setting up PPID has failed!', e);
		}
	}

	async call(): Promise<void> {
		const ppid = context.get('services.ppid');
		if (ppid?.enabled) {
			await this.setupPPID(ppid.strategy);
		} else {
			utils.logger(UserIdentity.logGroup, 'disabled');
		}
	}
}

export const userIdentity = new UserIdentity();
