import { Action, ActionType, ActiveData } from './adms-actions';
import { admsClient } from './adms-client';

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

	async setRemote(actionType: ActionType, data: Action): Promise<Response> {
		return admsClient.postData(actionType, data.payload);
	}

	setLocally(actionType: ActionType, data: Action): void {
		const localData = admsClient.getLocalData() || {};
		const sectionData = localData[ActionType.IDENTITY.toUpperCase()] || [];
		const mergedData = {
			...localData,
			[ActionType.IDENTITY.toUpperCase()]: [...sectionData, data],
		};
		admsClient.setLocalData(mergedData);
	}
}

export const admsService = new AdmsService();
