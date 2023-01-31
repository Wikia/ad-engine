import { identityStorageClient } from './identity-storage-client';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageService {
	async get(): Promise<Partial<IdentityStorageDto>> {
		const localData = await identityStorageClient.getLocalData();
		if (!localData) {
			const remoteData = await identityStorageClient.fetchData();
			identityStorageClient.setLocalData(remoteData);
			return remoteData;
		} else if (!localData.synced) {
			return this.setRemote(localData).then((response: IdentityStorageDto) => {
				identityStorageClient.setLocalData(response);
				return response;
			});
		}

		return localData;
	}

	async setRemote(data: IdentityStorageDto): Promise<IdentityStorageDto> {
		return identityStorageClient.postData(data);
	}
}

export const identityStorageService = new IdentityStorageService();
