import { servicesBaseURL } from '../utils/service-base-url';
import { UniversalStorage, utils } from '@ad-engine/core';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageClient {
	private logGroup = 'identity-storage';
	private IdentityStorageKey = 'identity';
	private ISUrl = servicesBaseURL() + 'identity-storage/';

	storage = new UniversalStorage();

	fetchData(): Promise<IdentityStorageDto> {
		return fetch(this.ISUrl, {
			mode: 'cors',
			credentials: 'include',
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
			})
			.catch((reason) => {
				utils.logger(this.logGroup, 'Loading Identity Storage data failed', reason);
			});
	}

	async postData(data: IdentityStorageDto): Promise<IdentityStorageDto> {
		return fetch(this.ISUrl + 'identity', {
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify({ ppid: data.ppid }),
		}).then((response) => response.json());
	}

	getLocalData(): IdentityStorageDto {
		return this.storage.getItem(this.IdentityStorageKey) as IdentityStorageDto;
	}

	setLocalData(data: Partial<IdentityStorageDto>): void {
		this.storage.setItem(this.IdentityStorageKey, data);
	}
}

export const identityStorageClient = new IdentityStorageClient();
