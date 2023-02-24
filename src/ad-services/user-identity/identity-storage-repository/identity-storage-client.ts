import { UniversalStorage, utils } from '@ad-engine/core';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageClient {
	private logGroup = 'identity-storage';
	private IdentityStorageKey = 'identity';
	private ISUrl = utils.getServicesBaseURL() + 'identity-storage/';

	storage = new UniversalStorage();

	fetchData(): Promise<IdentityStorageDto> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 1000);

		return fetch(this.ISUrl, {
			mode: 'cors',
			credentials: 'include',
			signal: controller.signal,
		})
			.then((response) => {
				clearTimeout(timeoutId);
				if (response.status === 200) {
					return response.json();
				} else {
					return this.createFallbackResponse();
				}
			})
			.catch((reason) => {
				utils.logger(this.logGroup, 'Loading Identity Storage data failed', reason);
				return this.createFallbackResponse();
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

	private createFallbackResponse(): IdentityStorageDto {
		return {
			timestamp: Date.now(),
			over18: false,
			synced: false,
			ppid: utils.uuid.v4(),
		};
	}
}

export const identityStorageClient = new IdentityStorageClient();
