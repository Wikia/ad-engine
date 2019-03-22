/**
 * Returns promise and executes callback if present.
 */
export function getPromiseAndExecuteCallback<T>(
	executor: (resolve: (value?: PromiseLike<T> | T) => void, reject: (reason?: any) => void) => void,
	callback?: (value?: PromiseLike<T> | T) => void,
): Promise<T> {
	const promise = new Promise(executor);

	if (callback && typeof callback === 'function') {
		promise.then(callback.bind(null, null), callback);
	}

	return promise;
}
