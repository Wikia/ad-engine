import { admsService } from './adms-service';
import { ActionType } from './adms-actions';
import { v4 as uuid } from 'uuid';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { StorageStrategyInterface } from '../storage-strategies';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';

class AdmsStrategy implements StorageStrategyInterface {
	async get(): Promise<string> {
		const userData = await admsService.get();
		utils.logger(UserIdentity.logGroup, userData);
		let identity = userData.IDENTITY?.map((identity) => identity.payload).find(
			(id) => id.identityType === 'ppid',
		);
		if (!identity) {
			utils.logger(UserIdentity.logGroup, 'ADMS', 'did not found Identity in ADMS Profile');
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
