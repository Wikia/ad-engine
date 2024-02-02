import { Dictionary } from '../models';

class QueryString {
	private readonly cache: Dictionary<URLSearchParams> = {};

	getURLSearchParams(input?: string): URLSearchParams {
		const path: string = input || window.location.search.substring(1);
		if (!this.cache[path]) {
			this.cache[path] = new URLSearchParams(path);
		}

		return this.cache[path];
	}

	get(key: string): string {
		const queryParameters = this.getURLSearchParams();

		return queryParameters.get(key);
	}

	isUrlParamSet(param: string): boolean {
		return !!parseInt(this.get(param), 10);
	}

	stringify(params: object): string {
		const queryParams = new URLSearchParams(params as Dictionary<string>);
		queryParams.sort();

		return queryParams.toString();
	}
}

export const queryString = new QueryString();
