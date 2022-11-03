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
			return this.setRemote(localData).then((response: IdentityStorageDataInterface) => {
				identityStorageClient.setLocalData(response);
				return response;
			});
		}

		return localData;
	}

	async setRemote(data: IdentityStorageDataInterface): Promise<IdentityStorageDataInterface> {
		return identityStorageClient.postData(data);
	}
}

export const identityStorageService = new IdentityStorageService();
