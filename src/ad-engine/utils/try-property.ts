export function whichProperty(
	obj: { [key: string]: any },
	properties: string[] = [],
): string | undefined {
	// tslint:disable-next-line
	return properties.find((property) => property in obj);
}

export function tryProperty(obj: { [key: string]: any }, properties: string[] = []) {
	const property = whichProperty(obj, properties);

	if (property) {
		const propertyValue = obj[property];

		return typeof propertyValue === 'function' ? propertyValue.bind(obj) : propertyValue;
	}
}
