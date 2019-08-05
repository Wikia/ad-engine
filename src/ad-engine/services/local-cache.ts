/* global Storage */
import { UniversalStorage } from './universal-storage';

interface CacheItem<T = any> {
	expires?: number;
	data: T;
}

class LocalCache {
	private storage = new UniversalStorage();

	isAvailable(): boolean {
		return this.storage.isAvailable();
	}

	// TODO: Should not return boolean if item expired
	get<T = any>(key: string): T {
		const cacheItem: CacheItem = this.storage.getItem<CacheItem>(key);

		if (cacheItem) {
			// Check if item has expired
			if (this.isExpired(cacheItem)) {
				this.delete(key);

				return false as any;
			}

			return cacheItem.data;
		}

		return false as any;
	}

	set(key: string, value: any, expires?: number): boolean {
		if (!this.isStorable(value)) {
			return false;
		}

		const cacheItem: CacheItem = {
			data: value,
			expires: expires ? expires * 1000 + Date.now() : undefined,
		};

		this.storage.setItem(key, cacheItem);

		return true;
	}

	delete(key: string): void {
		this.storage.removeItem(key);
	}

	private isStorable(value: any): boolean {
		const unstorableTypes: string[] = ['function', 'number', 'undefined'];
		const isStorableType = !unstorableTypes.some((type) => typeof value === type);
		const isNotNaN = !(typeof value === 'number' && isNaN(value));

		return isStorableType && isNotNaN;
	}

	private isExpired(cacheItem: CacheItem): boolean {
		if (cacheItem.expires) {
			return cacheItem.expires && Date.now() >= cacheItem.expires;
		}

		return false;
	}
}

export const localCache = new LocalCache();
