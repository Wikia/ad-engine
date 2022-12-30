import { admsService } from './adms-service';
import { ActionType, IdentityAction } from './adms-actions';
import { IdentityRepositoryInterface } from '../identity-repositories';
import { UniversalStorage, utils } from '@ad-engine/core';
import { UserIdentity } from '../';

class AdmsIdentityRepository implements IdentityRepositoryInterface {
	storage = new UniversalStorage();

	async get(): Promise<string> {
		const ppid = this.getLocalIdentityToken();
		if (ppid) {
			return ppid;
		}
		const userData = await admsService.get();
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

		this.setLocalIdentityToken(identity.payload.identityToken);
		return identity.payload.identityToken;
	}

	getLocalIdentityToken(): string | null {
		return this.storage.getItem('ppid');
	}

	setLocalIdentityToken(ppid: string) {
		this.storage.setItem('ppid', ppid);
	}
}

export const admsIdentityRepository = new AdmsIdentityRepository();
