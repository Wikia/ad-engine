class QueryString {
	private readonly cache = new Map<string, URLSearchParams>();

	getValues(input?: string): Record<string, string> {
		return [...this.getURLSearchParams(input).entries()].reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});
	}

	getURLSearchParams(input?: string): URLSearchParams {
		const path: string = input || window.location.search.substring(1);

		if (!this.cache.has(path)) {
			this.cache.set(path, new URLSearchParams(path));
		}

		return this.cache.get(path);
	}

	get(key: string): string {
		return this.getURLSearchParams().get(key) || '';
	}

	isUrlParamSet(param: string): boolean {
		return !!parseInt(this.get(param), 10);
	}

	stringify(params: Record<string, string>): string {
		const queryParams = new URLSearchParams(params);
		queryParams.sort();

		return queryParams.toString();
	}
}

export const queryString = new QueryString();
