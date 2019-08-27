export interface PromisedTimeout<T> {
	cancel: () => void;
	promise: Promise<T>;
}

export function buildPromisedTimeout(time): PromisedTimeout<number> {
	let timeoutId;
	const promise = new Promise<number>((resolve) => {
		timeoutId = setTimeout(() => resolve(time), time);
	});

	return {
		cancel() {
			clearTimeout(timeoutId);
		},
		promise,
	};
}
