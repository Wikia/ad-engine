import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { IdentityRepositories, IdentityRepositoryInterface } from './identity-repositories';
import { localStorageRepository } from './local-storage-repository';
import { admsIdentityRepository } from './adms-identity-repository';
import { communicationService, eventsRepository } from '@ad-engine/communication';

export class UserIdentity extends BaseServiceSetup {
	public static logGroup = 'user-identity';

	private getPPID(strategy: IdentityRepositories): IdentityRepositoryInterface {
		utils.logger(UserIdentity.logGroup, 'active strategy: ', strategy);
		switch (strategy) {
			case IdentityRepositories.ADMS:
				return admsIdentityRepository;
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
			context.set('targeting.ppid', ppid);
		} catch (e) {
			utils.logger(UserIdentity.logGroup, 'Setting up PPID has failed!', e);
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
		} else {
			utils.logger(UserIdentity.logGroup, 'disabled');
		}
	}
}

export const userIdentity = new UserIdentity();
