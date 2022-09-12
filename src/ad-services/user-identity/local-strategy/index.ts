import { communicationService, eventsRepository } from '@ad-engine/communication';
import { v4 as uuid } from 'uuid';
import { StorageStrategyInterface } from '../storage-strategies';

class LocalStorageStrategy implements StorageStrategyInterface {
	private generatePPID() {
		const ppid: string = uuid();
		localStorage.setItem('ppid', ppid);
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
		return Promise.resolve(localStorage.getItem('ppid') || this.generatePPID());
	}
}

export const localStorageStrategy = new LocalStorageStrategy();
