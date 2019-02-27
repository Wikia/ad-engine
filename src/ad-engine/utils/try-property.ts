export function whichProperty(obj, properties = []) {
	// TODO: replace with properties.find(...)
	// tslint:disable-next-line
	for (let i = 0; i < properties.length; i += 1) {
		const property = properties[i];

		if (typeof property !== 'string') {
			throw new Error('property name must be a string');
		}

		if (property in obj) {
			return property;
		}
	}

	return null;
}

export function tryProperty(obj, properties = []) {
	const property = whichProperty(obj, properties);

	if (property !== null) {
		const propertyValue = obj[property];

		return typeof propertyValue === 'function' ? propertyValue.bind(obj) : propertyValue;
	}

	return null;
}
