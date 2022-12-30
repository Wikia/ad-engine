import { IdentityRepositoryInterface } from '../identity-repositories';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { Messages } from '@fandom-frontend/cross-domain-storage/dist';
import { UniversalStorage, utils } from '@ad-engine/core';
import { GlobalIdentityProvider } from './global-identity-provider';
import { GlobalIdentityProviderStatus } from './global-identity-provider/GlobalIdentityProviderStatus';

class GlobalIdentityRepository implements IdentityRepositoryInterface {
	logGroup = 'GlobalIdentityRepository';
	storage = new UniversalStorage();
	identityProvider = new GlobalIdentityProvider();

	async get(): Promise<string> {
		await this.identityProvider.initialize();
		let identity = await this.getGlobalIdentity();
		const localIdentity = this.getLocalIdentity();
		if (!identity) {
			identity = localIdentity || utils.uuid.v4();
			this.setIdentity(identity);
		}
		this.setLocalIdentity(identity);
		return identity;
	}

	private getGlobalIdentity(): Promise<string | undefined> {
		if (this.identityProvider.status === GlobalIdentityProviderStatus.NOT_LOADED) {
			return Promise.resolve(undefined);
		}
		this.identityProvider.sendMessage(Messages.PPID_REQUEST);
		return new Promise((res) => {
			communicationService.on(eventsRepository.GLOBAL_IDENTITY_RECEIVED, (identity) => {
				utils.logger(this.logGroup, 'Received identity', identity.ppid);
				res(identity.ppid);
			});
		});
	}

	private getLocalIdentity(): string | undefined {
		return this.storage.getItem('ppid');
	}

	private setLocalIdentity(ppid: string): void {
		this.storage.setItem('ppid', ppid);
	}

	private setIdentity(ppid: string) {
		this.identityProvider.sendMessage(Messages.SET_PPID_REQUEST, ppid);
		this.setLocalIdentity(ppid);
	}
}

export const globalIdentityStorage = new GlobalIdentityRepository();
