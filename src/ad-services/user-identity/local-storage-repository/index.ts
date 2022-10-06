import { IdentityRepositoryInterface } from '../identity-repositories';
import { UniversalStorage, utils } from '@ad-engine/core';
import { UserIdentity } from '../';

class LocalStorageRepository implements IdentityRepositoryInterface {
	storage = new UniversalStorage();

	private generatePPID(): string {
		utils.logger(UserIdentity.logGroup, 'LocalStorage', 'did not found a PPID in LocalStorage');
		const ppid: string = utils.uuid.v4();
		this.storage.setItem('ppid', ppid);
		return ppid;
	}

	get(): Promise<string> {
		return Promise.resolve(this.storage.getItem('ppid') || this.generatePPID());
	}
}

export const localStorageRepository = new LocalStorageRepository();
