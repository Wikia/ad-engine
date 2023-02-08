import { context, UniversalStorage } from '@ad-engine/core';
import { ActiveData } from '../adms-identity-repository/adms-actions';
import { identityStorageClient } from './identity-storage-client';
import { IdentityStorageDto } from './identity-storage-dto';

class IdentityStorageService {
	WEEK_DIFFERENCE = 7 * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * miliseconds

	constructor(private storage: UniversalStorage) {}

	async get(): Promise<IdentityStorageDto> {
		const localData = await this.getLocalData();
		if (localData && !localData.synced) {
			await this.setRemote(localData);
		}
		if (!localData || this.isDeprecated(localData)) {
			return this.getRemote();
		} else {
			return localData;
		}
	}

	private isDeprecated(localData: IdentityStorageDto): boolean {
		const lastWeek = Date.now() - this.WEEK_DIFFERENCE;
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
		const remoteData = await identityStorageClient.postData(data);
		this.setIdentityContextVariables(remoteData);
		identityStorageClient.setLocalData({ ...remoteData, timestamp: Date.now() });
		return remoteData;
	}

	private setIdentityContextVariables(userData: IdentityStorageDto) {
		if (userData.over18) {
			context.set('targeting.over_18', '1');
		}
	}
}

export const identityStorageService = new IdentityStorageService(new UniversalStorage());
