import { BaseServiceSetup, context } from '@ad-engine/core';
import { StorageStrategies, StorageStrategyInterface } from './storage-strategies';
import { localStorageStrategy } from './local-strategy';
import { admsStorageService } from './adms-strategy';

export class UserIdentity extends BaseServiceSetup {
	private get STRATEGY(): StorageStrategies {
		const ppid = JSON.parse(context.get('services.ppid'));
		return ppid.storageType;
	}

	private getPPID(): StorageStrategyInterface {
		switch (this.STRATEGY) {
			case StorageStrategies.ADMS:
				return admsStorageService;
			case StorageStrategies.LOCAL:
			default:
				return localStorageStrategy;
		}
	}

	async setupPPID(): Promise<void> {
		context.set('targeting.ppid', await this.getPPID().get);
	}

	async call(): Promise<void> {
		const ppid = JSON.parse(context.get('services.ppid'));
		if (ppid.enabled) {
			await this.setupPPID();
		}
	}
}

export const userIdentity = new UserIdentity();
