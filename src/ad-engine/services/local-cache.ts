/* global Storage */
import { logger } from '../utils';

const logGroup = 'local-cache';

let canUseStorage;

class LocalCache {
	canUseStorage() {
		if (typeof canUseStorage === 'undefined') {
			canUseStorage = false;
			if (window.localStorage) {
				try {
					window.localStorage.setItem('test', '1');
					window.localStorage.removeItem('test');
					canUseStorage = true;
				} catch (e) {
					/* There are two known possibilities here:
					 *
					 * 1) The browser isn't allowing access due to a
					 * privacy setting (which can happen in Safari).
					 *
					 * 2) The allowed disk space for storage is used
					 * up. However, this is more likely to happen in
					 * calls to LocalCache.set().
					 */
					try {
						LocalCache.createPolyfill();
						canUseStorage = true;
					} catch (exception) {
						logger(logGroup, 'Local Storage polyfill error: ', exception);
					}
				}
			}
		}

		return canUseStorage;
	}

	createPolyfill() {
		logger(logGroup, 'Local Storage polyfill being created');
		Storage.prototype.data = {};

		Storage.prototype.setItem = function (id, val) {
			this.data[id] = String(val);
		};

		Storage.prototype.getItem = function (id) {
			return this.data[id] ? this.data[id] : null;
		};

		Storage.prototype.removeItem = function (id) {
			delete this.data[id];
		};

		Storage.prototype.clear = function () {
			this.data = {};
		};
	}

	get(key) {
		if (!this.canUseStorage()) {
			return false;
		}

		let cacheItem = window.localStorage.getItem(key);

		if (cacheItem) {
			// De-serialize
			cacheItem = JSON.parse(cacheItem);

			// Check if item has expired
			if (this.isExpired(cacheItem)) {
				this.delete(key);

				return false;
			}

			return cacheItem.data;
		}

		return false;
	}

	set(key, value, expires = null) {
		if (!this.canUseStorage() || !this.isStorable(value)) {
			return false;
		}

		const cacheItem = { data: value };
		const expiresValue = parseInt(expires, 10);

		if (!isNaN(expiresValue)) {
			// Set expiration as a JS timestamp
			cacheItem.expires = expiresValue * 1000 + Date.now();
		}

		try {
			window.localStorage.setItem(key, JSON.stringify(cacheItem));
		} catch (e) {
			// Local Storage is at capacity
			return false;
		}

		return true;
	}

	delete(key) {
		if (!this.canUseStorage()) {
			return;
		}

		window.localStorage.removeItem(key);
	}

	isStorable(value) {
		if (
			// Functions might be a security risk
			typeof value === 'function' ||
			// NaN
			(typeof value === 'number' && isNaN(value)) ||
			// undefined
			typeof value === 'undefined'
		) {
			return false;
		}

		return true;
	}

	isExpired(cacheItem) {
		return cacheItem.expires && Date.now() >= parseInt(cacheItem.expires, 10);
	}
}

export const localCache = new LocalCache();
