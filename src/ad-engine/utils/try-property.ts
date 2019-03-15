export function whichProperty(obj: {} = {}, properties: string[] = []): string | undefined {
	return properties.find((property: string) => {
		if (typeof property !== 'string') {
			throw new Error('property name must be a string');
		}

		return property in obj;
	});
}

export function tryProperty(obj: {}, properties: string[] = []): boolean | undefined {
	const property = whichProperty(obj, properties);

	if (!!property) {
		const propertyValue = (obj as any)[property];

		return typeof propertyValue === 'function' ? propertyValue.bind(obj) : propertyValue;
	}

	return undefined;
}
