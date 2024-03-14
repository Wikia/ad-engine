export function withDebounce(
	original: (...args: unknown[]) => void,
	timeout: number,
): (...args: unknown[]) => void {
	let timeoutRef = null;
	return function (...args: unknown[]): void {
		clearTimeout(timeoutRef);

		// schedule debounce timer
		timeoutRef = setTimeout(() => {
			// call original function
			original.apply(this, args);
		}, timeout);
	};
}

export function debounce(timeout: number): any {
	let timeoutRef = null;
	return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
		const original = descriptor.value;

		// override original function
		descriptor.value = function (...args: unknown[]) {
			clearTimeout(timeoutRef);

			// schedule debounce timer
			timeoutRef = setTimeout(() => {
				// call original function
				original.apply(this, args);
			}, timeout);
		};

		// return descriptor with new value
		return descriptor;
	};
}
