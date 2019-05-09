import { context } from '../services';

class StringBuilder {
	build(string: string, parameters: any = {}): string {
		const matches: RegExpMatchArray = string.match(/{(.+?)}/g);

		if (matches) {
			matches.forEach((match) => {
				const key: string = match.replace('{', '').replace('}', '');
				const fallbackValue: string = context.get(key);
				const keySegments: string[] = key.split('.');
				let index: number;
				let segment: string;
				let value: any = parameters[keySegments[0]];

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
