import { context, targetingService, UniversalStorage, utils } from '@ad-engine/core';
import { ActiveData } from '../adms-identity-repository/adms-actions';
import { identityStorageClient } from './identity-storage-client';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageService {
	constructor(private storage: UniversalStorage) {}

	async get(): Promise<IdentityStorageDto> {
		const localData = await this.getLocalData();
		if (localData && !localData.synced) {
			this.setRemote(localData);
		}
		if (!localData || this.isDeprecated(localData)) {
			return this.getRemote();
		} else {
			this.setIdentityContextVariables(localData);
			return localData;
		}
	}

	private isDeprecated(localData: IdentityStorageDto): boolean {
		const timeDifference = context.get('services.identityTtl') || 7 * 24 * 60 * 60 * 1000; // Fallback : days * hours * minutes * seconds * miliseconds;
		const lastWeek = Date.now() - timeDifference;
		return !localData.timestamp || localData.timestamp - lastWeek < 0;
	}

	private async getLocalData() {
		let localIdentity = await identityStorageClient.getLocalData();
		if (!localIdentity) {
			const deprecatedPpid = this.getLocalPPID() || this.getAdmsPPID();
			if (deprecatedPpid) {
				localIdentity = await this.migrateDeprecatedIdentity(deprecatedPpid);
			}
		}
		return localIdentity;
	}

	private async migrateDeprecatedIdentity(deprecatedPPID: string) {
		const remoteData = await this.setRemote({ ppid: deprecatedPPID, synced: false });
		this.clearDeprecatedLocalPpid();
		return remoteData;
	}

	private getAdmsPPID(): string | null {
		const admsData = this.storage.getItem<ActiveData>('silver-surfer-active-data-v2') as ActiveData;
		return admsData?.IDENTITY?.[0].payload?.identityToken;
	}

	private getLocalPPID(): string | null {
		return this.storage.getItem('ppid');
	}

	private clearDeprecatedLocalPpid() {
		this.storage.removeItem('ppid');
	}

	private async getRemote(): Promise<IdentityStorageDto> {
		const remoteData = await identityStorageClient.fetchData();
		this.setIdentityContextVariables(remoteData);
		identityStorageClient.setLocalData({ ...remoteData, timestamp: Date.now() });
		return remoteData;
	}

	async setRemote(data: IdentityStorageDto): Promise<IdentityStorageDto> {
		try {
			await identityStorageClient.postData(data);
			const localData = { ...identityStorageClient.getLocalData(), synced: true };
			this.setIdentityContextVariables(localData);
			identityStorageClient.setLocalData({ ...localData, timestamp: Date.now() });
			return localData;
		} catch (ex) {
			utils.logger('identity-storage', 'Updating Identity Storage data failed');
		}
	}

	private setIdentityContextVariables(userData: IdentityStorageDto) {
		if (userData.over18) {
			targetingService.set('over_18', '1');
		}
	}
}

export const identityStorageService = new IdentityStorageService(new UniversalStorage());
