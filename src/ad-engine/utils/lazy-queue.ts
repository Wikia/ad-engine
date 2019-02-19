/**
 * @deprecated
 * @param queue
 * @param callback
 * Please use LazyQueue class instead
 */
export function makeLazyQueue(queue, callback) {
	if (typeof callback !== 'function') {
		throw new Error('LazyQueue used with callback not being a function');
	} else if (queue instanceof Array) {
		queue.start = function () {
			while (queue.length > 0) {
				callback(queue.shift());
			}
			queue.push = function (item) {
				callback(item);
			};
		};
	} else {
		throw new Error('LazyQueue requires an array as the first parameter');
	}
}

/**
 * example: https://stackblitz.com/edit/wikia-lazy-queue
 */
export class LazyQueue {
	get length() {
		return this.items.length;
	}

	// itemFlushed = {}; // RxJs Subject

	/**
	 * @private
	 */
	itemFlushCallbacks = [];

	/**
	 * @private
	 */
	pushCommand = undefined;

	/**
	 * @private
	 */
	items = [];

	constructor(...items) {
		this.items = [...items];
		this.setPreFlushPush();
	}

	// old start
	flush() {
		while (this.items.length > 0) {
			this.emit(this.items.shift());
		}
		this.setPostFlushPush();
	}

	push(...items) {
		this.pushCommand(...items);
	}

	/**
	 * @param {function} callback
	 */
	onItemFlush(callback) {
		if (typeof callback !== 'function') {
			throw new Error('onItemFlush used with callback not being a function');
		}
		this.itemFlushCallbacks.push(callback);
	}

	/**
	 * @private
	 */
	setPreFlushPush() {
		this.pushCommand = (...items) => {
			this.items.push(...items);
		};
	}

	/**
	 * @private
	 */
	setPostFlushPush() {
		this.pushCommand = (...items) => {
			items.forEach((item) => {
				this.emit(item);
			});
		};
	}

	/**
	 * @private
	 */
	emit(item) {
		// this.flushed.next(item);
		this.itemFlushCallbacks.forEach((flushCallback) => {
			flushCallback(item);
		});
	}
}
