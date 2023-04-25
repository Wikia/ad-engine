export function getGlobalValue<T>(name: string): T | undefined {
	const global = getGlobal();
	let value: unknown;
	if (global !== undefined) {
		value = global[name];
	}
	return value as T | undefined;
}

export function getGlobal(): any | undefined {
	if (typeof window !== 'undefined') {
		return window;
	}
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}
	if (typeof self !== 'undefined') {
		return self;
	}
	if (typeof global !== 'undefined') {
		return global;
	}
	return undefined;
}
