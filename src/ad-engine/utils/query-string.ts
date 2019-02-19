class QueryString {
	getValues(input = null) {
		const path = input || window.location.search.substr(1);
		const queryParameters = {};
		const queryString = path.split('&');

		if (queryString === '') {
			return null;
		}

		queryString.forEach((pair) => {
			const [id, value] = pair.split('=');

			if (value) {
				queryParameters[id] = decodeURIComponent(value.replace(/\+/g, ' '));
			}
		});

		return queryParameters;
	}

	get(key) {
		const queryParameters = this.getValues();

		return queryParameters[key];
	}

	isUrlParamSet(param) {
		return !!parseInt(this.get(param), 10);
	}
}

export const queryString = new QueryString();
