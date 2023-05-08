export function getGlobalValue<T>(name: string): T | undefined {
	const global = getGlobal();
	let value: unknown;
	if (global !== undefined) {
		value = global[name];
	}
	return value as T | undefined;
}

export function getGlobal(): any | undefined {
	return (
		(typeof window !== 'undefined' && window) ||
		(typeof globalThis !== 'undefined' && globalThis) ||
		(typeof self !== 'undefined' && self) ||
		(typeof global !== 'undefined' && global) ||
		undefined
	);
}
