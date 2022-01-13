export const wait = (milliseconds = 0) =>
	new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number') {
			reject(new Error('Delay value must be a number.'));

			return;
		}

		setTimeout(resolve, milliseconds);
	});

export function defer<T>(fn: (...args: any) => T, ...args: any): Promise<T> {
	return new Promise((resolve, reject) => {
		if (typeof fn !== 'function') {
			reject(new Error('Expected a function.'));

			return;
		}

		setTimeout(() => resolve(fn(...args)), 0);
	});
}

export function once(
	emitter: HTMLElement | Window,
	eventName: string,
	options = {},
): Promise<any | Event> {
	const isObject: boolean = typeof emitter === 'object';
	const hasAddEventListener: boolean =
		isObject && typeof (emitter as HTMLElement).addEventListener === 'function';

	return new Promise((resolve, reject) => {
		if (typeof options === 'boolean') {
			options = { capture: options };
		}

		if (hasAddEventListener) {
			(emitter as HTMLElement).addEventListener(eventName, resolve, { ...options, once: true });
		} else {
			reject(new Error('Emitter does not have `addEventListener` nor `once` method.'));
		}
	});
}

export function timeoutReject(msToTimeout: number): Promise<any> {
	return new Promise((resolve, reject) => {
		setTimeout(reject, msToTimeout);
	});
}

/**
 * Fires the Promise if function is fulfilled or timeout is reached
 */
export function createWithTimeout(func: (...args: any) => any, msToTimeout = 2000): Promise<any> {
	return Promise.race([new Promise(func), timeoutReject(msToTimeout)]);
}

type PromiseExecutor<T> = ConstructorParameters<PromiseConstructor>[0];
export type PromiseResolve<T> = Parameters<PromiseExecutor<T>>[0];
export type PromiseReject = Parameters<PromiseExecutor<any>>[1];
export type ExtendedPromise<T> = Promise<T> & { resolve: PromiseResolve<T>; reject: PromiseReject };

export function createExtendedPromise<T = void>(): ExtendedPromise<T> {
	let resolve: PromiseResolve<T>;
	let reject: PromiseReject;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	promise['resolve'] = resolve;
	promise['reject'] = reject;

	return promise as ExtendedPromise<T>;
}
