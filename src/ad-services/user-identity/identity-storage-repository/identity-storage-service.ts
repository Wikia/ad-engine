import { context, UniversalStorage } from '@ad-engine/core';
import { identityStorageClient } from './identity-storage-client';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageService {
	constructor(private storage: UniversalStorage) {}

	async get(): Promise<Partial<IdentityStorageDto>> {
		const deprecatedPPID = this.getLocalIdentityToken();
		if (deprecatedPPID) {
			return await this.migrateExistingPpid(deprecatedPPID);
		} else {
			const localData = await identityStorageClient.getLocalData();
			if (!localData) {
				const remoteData = await identityStorageClient.fetchData();
				this.updateLocalData(remoteData);
				return remoteData;
			} else if (!localData.synced) {
				const remoteData = await this.setRemote(localData);
				this.updateLocalData(remoteData);
				return remoteData;
			}

			this.setIdentityContextVariables(localData);
			return localData;
		}
	}

	private async migrateExistingPpid(deprecatedPPID: string) {
		this.storage.removeItem('ppid');

		const remoteData = await this.setRemote({ ppid: deprecatedPPID, synced: false });
		this.updateLocalData(remoteData);
		return remoteData;
	}

	private getLocalIdentityToken(): string | null {
		return this.storage.getItem('ppid');
	}

	private updateLocalData(userData: IdentityStorageDto) {
		identityStorageClient.setLocalData(userData);
		this.setIdentityContextVariables(userData);
	}

	private setIdentityContextVariables(userData: IdentityStorageDto) {
		context.set('targeting.over_18', userData.over18 ? '1' : '0');
	}

	async setRemote(data: IdentityStorageDto): Promise<IdentityStorageDto> {
		return identityStorageClient.postData(data);
	}
}

export const identityStorageService = new IdentityStorageService(new UniversalStorage());
