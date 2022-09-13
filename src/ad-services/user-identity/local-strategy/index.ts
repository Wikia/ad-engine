import { communicationService, eventsRepository } from '@ad-engine/communication';
import { StorageStrategyInterface } from '../storage-strategies';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';

class LocalStorageStrategy implements StorageStrategyInterface {
	private generatePPID(): string {
		utils.logger(UserIdentity.logGroup, 'LocalStorage', 'did not found a PPID in LocalStorage');
		const ppid: string = utils.uuid.v4();
		utils.storage.set('ppid', ppid);
		communicationService.dispatch({
			type: eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
			payload: {
				partnerName: 'Google',
				partnerIdentityId: ppid,
			},
		});

		return ppid;
	}

	get(): Promise<string> {
		return Promise.resolve(utils.storage.get('ppid') || this.generatePPID());
	}
}

export const localStorageStrategy = new LocalStorageStrategy();
