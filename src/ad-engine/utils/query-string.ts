import { Dictionary } from '../models';

type QueryValue = boolean | string | string[] | number | number[] | object | null;

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

	parseValue(value: string): QueryValue {
		if (value === 'true' || value === 'false') {
			return value === 'true';
		}

		const intValue = parseInt(value, 10);
		if (value === `${intValue}`) {
			return intValue;
		}

		try {
			return JSON.parse(value);
		} catch (ignore) {
			if (value.startsWith('[') && value.endsWith(']')) {
				return value.slice(1, -1).split(',');
			}
			return value || null;
		}
	}
}

export const queryString = new QueryString();
