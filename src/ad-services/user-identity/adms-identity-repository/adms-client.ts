import { ActionType, Action, ActiveData } from './adms-actions';
import { UniversalStorage, utils } from '@ad-engine/core';
import { UserIdentity } from '../index';

class AdmsClient {
	private ADMSStorageKey = 'silver-surfer-active-data-v2';
	private ADMS = utils.getServicesBaseURL() + 'active-data-management-service/';
	storage = new UniversalStorage();

	fetchData(): Promise<ActiveData> {
		return fetch(this.ADMS + `profiles?cb=${Date.now()}`, {
			mode: 'cors',
			credentials: 'include',
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
			})
			.catch((reason) => {
				utils.logger(UserIdentity.logGroup, 'Loading ADMS data failed', reason);
			});
	}

	async postData(actionType: ActionType, data): Promise<Response> {
		const action: Action = {
			time: Date.now(),
			name: actionType.toLowerCase(),
			type: actionType,
			payload: {
				...data,
				_type: actionType,
			},
		};
		return fetch(this.ADMS + 'validate/', {
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify(action),
		});
	}

	getLocalData(): ActiveData {
		return this.storage.getItem(this.ADMSStorageKey) as ActiveData;
	}

	setLocalData(data: Partial<ActiveData>): void {
		this.storage.setItem(this.ADMSStorageKey, data);
	}
}

export const admsClient = new AdmsClient();
