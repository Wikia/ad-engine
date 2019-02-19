import { context } from '../services';

class StringBuilder {
	build(string, parameters = {}) {
		const matches = string.match(/{(.+?)}/g);

		if (matches) {
			matches.forEach((match) => {
				const key = match.replace('{', '').replace('}', '');
				const fallbackValue = context.get(key);
				const keySegments = key.split('.');
				let index;
				let segment;
				let value = parameters[keySegments[0]];

				if (value) {
					for (index = 1; index < keySegments.length; index += 1) {
						segment = keySegments[index];
						if (typeof value[segment] === 'undefined') {
							value = undefined;
							break;
						}
						value = value[segment];
					}
				}

				if (typeof value === 'undefined') {
					value = fallbackValue;
				}
				if (typeof value !== 'undefined') {
					string = string.replace(match, value);
				}
			});
		}

		return string;
	}
}

export const stringBuilder = new StringBuilder();
