import { admsClient } from './adms-client';
import { Action, ActionType, ActiveData } from './adms-actions';

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

	async set(actionType: ActionType, data: Action): Promise<void> {
		const localData = admsClient.getLocalData() || {};
		const sectionData = localData[actionType.toUpperCase()] || [];
		const mergedData = { ...localData, [actionType.toUpperCase()]: [...sectionData, data] };
		admsClient.setLocalData(mergedData);
		await admsClient.postData(actionType, data.payload);
	}
}

export const admsService = new AdmsService();
