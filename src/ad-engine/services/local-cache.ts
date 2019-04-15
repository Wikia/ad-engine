/* global Storage */
import { logger } from '../utils';

interface CacheItem {
	expires?: number;
	data: any;
}

const logGroup = 'local-cache';

let canUseStorage: boolean;

class LocalCache {
	canUseStorage(): boolean {
		if (typeof canUseStorage === 'undefined') {
			canUseStorage = false;
			try {
				if (window.localStorage) {
					window.localStorage.setItem('test', '1');
					window.localStorage.removeItem('test');
					canUseStorage = true;
				}
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
					this.createPolyfill();
					canUseStorage = true;
				} catch (exception) {
					logger(logGroup, 'Local Storage polyfill error: ', exception);
				}
			}
		}

		return canUseStorage;
	}

	createPolyfill(): void {
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

	get(key: string): any {
		if (!this.canUseStorage()) {
			return false;
		}

		const cacheItem = window.localStorage.getItem(key);

		if (cacheItem) {
			// De-serialize
			const unpacked: CacheItem = JSON.parse(cacheItem);

			// Check if item has expired
			if (this.isExpired(unpacked)) {
				this.delete(key);

				return false;
			}

			return unpacked.data;
		}

		return false;
	}

	set(key: string, value: any, expires?: number): boolean {
		if (!this.canUseStorage() || !this.isStorable(value)) {
			return false;
		}

		const cacheItem: CacheItem = { data: value };

		if (expires) {
			// Set expiration as a JS timestamp
			cacheItem.expires = expires * 1000 + Date.now();
		}

		try {
			window.localStorage.setItem(key, JSON.stringify(cacheItem));
		} catch (e) {
			// Local Storage is at capacity
			return false;
		}

		return true;
	}

	delete(key: string): void {
		if (!this.canUseStorage()) {
			return;
		}

		window.localStorage.removeItem(key);
	}

	isStorable(value: any): boolean {
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

	isExpired(cacheItem: CacheItem): boolean {
		if (cacheItem.expires) {
			return cacheItem.expires && Date.now() >= cacheItem.expires;
		}
		return false;
	}
}

export const localCache = new LocalCache();
