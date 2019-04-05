import { Dictionary } from '../models';

export function whichProperty(obj: Dictionary = {}, properties: string[] = []): string | undefined {
	return properties.find((property: string) => {
		if (typeof property !== 'string') {
			throw new Error('property name must be a string');
		}

		return property in obj;
	});
}

export function tryProperty(
	obj: Dictionary,
	properties: string[] = [],
): () => boolean | boolean | undefined {
	const property: string = whichProperty(obj, properties);

	if (!!property) {
		const propertyValue: any = obj[property];

		return typeof propertyValue === 'function' ? propertyValue.bind(obj) : propertyValue;
	}

	return undefined;
}
