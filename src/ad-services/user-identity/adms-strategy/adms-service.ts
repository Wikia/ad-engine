import { admsClient } from './adms-client';
import { ActionType, ActiveData } from './adms-actions';

class AdmsService {
	async get(): Promise<Partial<ActiveData>> {
		const localData = await admsClient.getLocalData();
		if (!localData) {
			const remoteData = await admsClient.fetchData();
			if (remoteData) {
				admsClient.setLocalData(remoteData);
			}
			return remoteData;
		}
		return localData;
	}

	async set(actionType: ActionType, data: unknown): Promise<void> {
		const localData = admsClient.getLocalData() || {};
		const sectionData = localData[actionType.toUpperCase()] || [];
		const mergedData = { ...localData, [actionType.toUpperCase()]: [...sectionData, data] };
		admsClient.setLocalData(mergedData);
		await admsClient.postData(actionType, data);
	}
}

export const admsService = new AdmsService();
