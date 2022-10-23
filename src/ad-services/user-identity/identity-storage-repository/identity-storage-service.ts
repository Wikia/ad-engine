import { identityStorageClient } from './identity-storage-client';
import { IdentityStorageDataInterface } from './identity-storage-data-interface';

class IdentityStorageService {
	async get(): Promise<Partial<IdentityStorageDataInterface>> {
		const localData = await identityStorageClient.getLocalData();
		if (!localData) {
			const remoteData = await identityStorageClient.fetchData();
			identityStorageClient.setLocalData(remoteData);
			return remoteData;
		} else if (!localData.synced) {
			return this.setRemote(localData);
		}

		return localData;
	}

	async setRemote(data: IdentityStorageDataInterface): Promise<IdentityStorageDataInterface> {
		return identityStorageClient.postData(data);
	}

	setLocally(data: IdentityStorageDataInterface): void {
		identityStorageClient.setLocalData(data);
	}
}

export const identityStorageService = new IdentityStorageService();
