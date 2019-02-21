/**
 * Returns promise and executes callback if present.
 * @param {function} func - Function to from which a promise is made.
 * @param {function=} callback
 * @returns {Promise}
 */
export function getPromiseAndExecuteCallback(func, callback = null) {
	const promise = new Promise(func);

	if (callback && typeof callback === 'function') {
		promise.then(callback.bind(null, null), callback);
	}

	return promise;
}
