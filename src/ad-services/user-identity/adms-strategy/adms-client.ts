import { ActionType, Action, ActiveData } from './adms-actions';
import { utils } from '@ad-engine/core';
import { UserIdentity } from '../index';

export function getServicesBaseURL() {
	return window.location.hostname.includes('fandom.com')
		? 'https://services.fandom.com/'
		: 'https://services.fandom-dev.' +
				(location.hostname.match(/(?!\.)(pl|us)$/) || ['us'])[0] +
				'/';
}

class AdmsClient {
	private ADMS = getServicesBaseURL() + 'active-data-management-service/';

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

	async postData(actionType: ActionType, data): Promise<void> {
		const action: Action = {
			time: Date.now(),
			name: 'identity',
			type: actionType,
			payload: {
				...data,
				_type: actionType,
			},
		};

		await fetch(this.ADMS + 'validate/', {
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
		return utils.storage.get('silver-surfer-active-data-v2');
	}

	setLocalData(data: Partial<ActiveData>): void {
		utils.storage.set('silver-surfer-active-data-v2', data);
	}
}

export const admsClient = new AdmsClient();
