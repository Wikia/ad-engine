import { admsClient } from './adms-client';
import { ActionType } from './adms-actions';

export interface ActiveData {
	IDENTITY?: {
		identityType: string;
		identityToken: string;
	}[];
	QUIZ?: any;
	HEALTH?: any;
}

class AdmsService {
	async get(): Promise<Partial<ActiveData>> {
		const localData = await admsClient.getLocalData();
		if (!localData) {
			const remoteData = await admsClient.fetchData();
			admsClient.setLocalData(remoteData);
			return remoteData;
		}
		return localData;
	}

	async set(actionType: ActionType, data: unknown): Promise<void> {
		const localData = admsClient.getLocalData();
		const sectionData = localData[actionType.toUpperCase()] || [];
		const mergedData = { ...localData, [actionType.toUpperCase()]: [...sectionData, data] };
		admsClient.setLocalData(mergedData);
		await admsClient.postData(actionType, data);
	}
}

export const admsService = new AdmsService();
