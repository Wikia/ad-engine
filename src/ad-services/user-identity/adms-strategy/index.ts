import { admsService } from './adms-service';
import { ActionType } from './adms-actions';
import { v4 as uuid } from 'uuid';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { StorageStrategyInterface } from '../storage-strategies';

class AdmsStrategy implements StorageStrategyInterface {
	async get(): Promise<string> {
		const userData = await admsService.get();
		let identity = userData.IDENTITY?.find((identity) => identity.identityType === 'ppid');
		if (!identity) {
			const newPpid = uuid();
			identity = {
				identityType: 'ppid',
				identityToken: newPpid,
			};
			communicationService.dispatch({
				type: eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
				payload: {
					partnerName: 'Google',
					partnerIdentityId: newPpid,
				},
			});
			admsService.set(ActionType.IDENTITY, identity);
		}
		return identity.identityToken;
	}
}

export const admsStorageService = new AdmsStrategy();
