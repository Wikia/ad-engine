import { ActiveData } from './adms-service';
import { ActionType, Action } from './adms-actions';

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
		return fetch(this.ADMS + 'profiles/', {
			mode: 'cors',
			credentials: 'include',
		}).then((response) => {
			return response.body as ActiveData;
		});
	}

	postData(actionType: ActionType, data): Promise<Response> {
		const action: Action = {
			time: Date.now(),
			name: 'identity',
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
		return JSON.parse(localStorage.getItem('silver-surfer-active-data-v2'));
	}

	setLocalData(data: Partial<ActiveData>): void {
		localStorage.setItem('silver-surfer-active-data-v2', JSON.stringify(data));
	}
}

export const admsClient = new AdmsClient();
