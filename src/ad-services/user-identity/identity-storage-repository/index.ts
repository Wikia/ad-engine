import { IdentityRepositoryInterface } from '../identity-repositories';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';
import { identityStorageService } from './identity-storage-service';

class IdentityStorageRepository implements IdentityRepositoryInterface {
	async get(): Promise<string> {
		const userData = await identityStorageService.get();
		utils.logger(UserIdentity.logGroup, userData);

		return userData.ppid;
	}
}

export const identityStorageRepository = new IdentityStorageRepository();
