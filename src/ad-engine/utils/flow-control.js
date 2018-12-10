export const wait = (milliseconds = 0) =>
	new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number') {
			reject(new Error('Delay value must be a number.'));

			return;
		}

		setTimeout(resolve, milliseconds);
	});

export const defer = (fn, ...args) =>
	new Promise((resolve, reject) => {
		if (typeof fn !== 'function') {
			reject(new Error('Expected a function.'));

			return;
		}

		setTimeout(() => resolve(fn(...args)), 0);
	});

export function once(emitter, eventName, options = {}) {
	const isObject = typeof emitter === 'object';
	const hasAddEventListener = isObject && typeof emitter.addEventListener === 'function';
	const hasOnce = isObject && typeof emitter.once === 'function';

	return new Promise((resolve, reject) => {
		if (typeof options === 'boolean') {
			options = { capture: options };
		}

		if (hasOnce) {
			emitter.once(eventName, resolve);
		} else if (hasAddEventListener) {
			emitter.addEventListener(eventName, resolve, Object.assign({}, options, { once: true }));
		} else {
			reject(new Error('Emitter does not have `addEventListener` nor `once` method.'));
		}
	});
}
