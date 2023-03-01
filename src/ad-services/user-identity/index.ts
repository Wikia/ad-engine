import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, targetingService, utils } from '@ad-engine/core';
import { admsIdentityRepository } from './adms-identity-repository';
import { globalIdentityStorage } from './global-identity-repository';
import { IdentityRepositories, IdentityRepositoryInterface } from './identity-repositories';
import { identityStorageRepository } from './identity-storage-repository';
import { localStorageRepository } from './local-storage-repository';

export class UserIdentity extends BaseServiceSetup {
	public static logGroup = 'user-identity';

	private getPPID(strategy: IdentityRepositories): IdentityRepositoryInterface {
		utils.logger(UserIdentity.logGroup, 'active strategy: ', strategy);
		switch (strategy) {
			case IdentityRepositories.ADMS:
				return admsIdentityRepository;
			case IdentityRepositories.IDENTITY_STORAGE:
				return identityStorageRepository;
			case IdentityRepositories.GLOBAL_IDENTITY:
				return globalIdentityStorage;
			case IdentityRepositories.LOCAL:
			default:
				return localStorageRepository;
		}
	}

	async setupPPID(): Promise<void> {
		try {
			const strategy = context.get('services.ppidRepository');
			const ppid = await this.getPPID(strategy).get();
			communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
				partnerName: 'Google',
				partnerIdentityId: ppid,
			});
			targetingService.set('ppid', ppid);
			utils.logger(UserIdentity.logGroup, 'Passed PPID to page-level targeting');
		} catch (e) {
			utils.logger(UserIdentity.logGroup, 'Setting up PPID has failed!', e);
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			utils.logger(UserIdentity.logGroup, 'enabled - awaiting setup');
			await this.setupPPID();
		} else {
			utils.logger(UserIdentity.logGroup, 'disabled');
		}
	}
}
