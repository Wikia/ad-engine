import { admsService } from './adms-service';
import { ActionType, IdentityAction } from './adms-actions';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { IdentityRepositoryInterface } from '../identity-repositories';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';

class AdmsIdentityRepository implements IdentityRepositoryInterface {
	async get(): Promise<string> {
		const userData = await admsService.get();
		utils.logger(UserIdentity.logGroup, userData);
		let identity: IdentityAction = userData?.IDENTITY?.find(
			(id) => id.payload.identityType === 'ppid',
		);
		if (!identity) {
			utils.logger(UserIdentity.logGroup, 'ADMS', 'did not found Identity in ADMS Profile');
			const newPpid = utils.uuid.v4();
			identity = {
				payload: {
					identityType: 'ppid',
					identityToken: newPpid,
				},
				type: ActionType.IDENTITY,
				name: 'identity',
				time: Date.now(),
			};
			communicationService.dispatch({
				type: eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
				payload: {
					partnerName: 'Google',
					partnerIdentityId: newPpid,
				},
			});
			const setResult = await admsService.setRemote(ActionType.IDENTITY, identity);
			if (setResult.ok) {
				admsService.setLocally(ActionType.IDENTITY, identity);
			}
		}
		return identity.payload.identityToken;
	}
}

export const admsIdentityRepository = new AdmsIdentityRepository();
