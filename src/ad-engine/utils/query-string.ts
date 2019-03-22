import { Dictionary } from '../models';

class QueryString {
	getValues(input?: string): Dictionary<string> {
		const path: string = input || window.location.search.substr(1);
		const queryStringParameters: string[] = path.split('&');
		const queryParameters: Dictionary<string> = {};

		queryStringParameters.forEach((pair) => {
			const [id, value] = pair.split('=');

			if (value) {
				queryParameters[id] = decodeURIComponent(value.replace(/\+/g, ' '));
			}
		});

		return queryParameters;
	}

	get(key: string): string {
		const queryParameters = this.getValues();

		return queryParameters[key];
	}

	isUrlParamSet(param: string): boolean {
		return !!parseInt(this.get(param), 10);
	}
}

export const queryString = new QueryString();
