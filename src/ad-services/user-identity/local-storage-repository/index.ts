import { IdentityRepositoryInterface } from '../identity-repositories';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';
import { UniversalStorage } from '../../../ad-engine/services/universal-storage';
import { communicationService, eventsRepository } from '@ad-engine/communication';

class LocalStorageRepository implements IdentityRepositoryInterface {
	storage = new UniversalStorage();

	private generatePPID(): string {
		utils.logger(UserIdentity.logGroup, 'LocalStorage', 'did not found a PPID in LocalStorage');
		const ppid: string = utils.uuid.v4();
		this.storage.setItem('ppid', ppid);
		communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
			partnerName: 'Google',
			partnerIdentityId: ppid,
		});
		return ppid;
	}

	get(): Promise<string> {
		return Promise.resolve(this.storage.getItem('ppid') || this.generatePPID());
	}
}

export const localStorageRepository = new LocalStorageRepository();
