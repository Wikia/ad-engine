import { utils } from '@ad-engine/core';
import { UserIdentity } from '../';
import { IdentityRepositoryInterface } from '../identity-repositories';
import { ActionType, IdentityAction } from './adms-actions';
import { admsService } from './adms-service';

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
			admsService.setRemote(ActionType.IDENTITY, identity).then((result) => {
				if (result.ok) {
					admsService.setLocally(ActionType.IDENTITY, identity);
				}
			});
		}

		return identity.payload.identityToken;
	}
}

export const admsIdentityRepository = new AdmsIdentityRepository();
