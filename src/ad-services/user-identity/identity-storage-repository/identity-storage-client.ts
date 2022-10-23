import { servicesBaseURL } from '../utils/service-base-url';
import { UniversalStorage, utils } from '@ad-engine/core';
import { IdentityStorageDataInterface } from './identity-storage-data-interface';

class IdentityStorageClient {
	private logGroup = 'identity-storage';
	private IdentityStorageKey: 'identity';
	private ISUrl = servicesBaseURL() + 'identity-storage';
	storage = new UniversalStorage();

	fetchData(): Promise<IdentityStorageDataInterface> {
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

	async postData(data: IdentityStorageDataInterface): Promise<IdentityStorageDataInterface> {
		return fetch(this.ISUrl, {
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			method: 'PUT',
			body: JSON.stringify(data),
		}).then((response) => response.json());
	}

	getLocalData(): IdentityStorageDataInterface {
		return this.storage.getItem(this.IdentityStorageKey) as IdentityStorageDataInterface;
	}

	setLocalData(data: Partial<IdentityStorageDataInterface>): void {
		this.storage.setItem(this.IdentityStorageKey, data);
	}
}

export const identityStorageClient = new IdentityStorageClient();
