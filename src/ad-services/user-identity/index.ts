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
		const ppid = await this.getPPID(strategy).get();
		utils.logger(UserIdentity.logGroup, 'PPID: ', ppid);
		context.set('targeting.ppid', ppid);
	}

	async call(): Promise<void> {
		const ppid = context.get('services.ppid');
		if (ppid.enabled) {
			await this.setupPPID(ppid.strategy);
		} else {
			utils.logger(UserIdentity.logGroup, 'disabled');
		}
	}
}

export const userIdentity = new UserIdentity();
