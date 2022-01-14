import { UniversalStorage } from './universal-storage';

class LocalCache {
	private storage = new UniversalStorage();

	isAvailable(): boolean {
		return this.storage.isAvailable();
	}

	// @TODO: Should not return boolean if item expired
	get(key: string): boolean | unknown {
		const cacheItem: Record<string, unknown> = this.storage.getItem<Record<string, unknown>>(key);

		if (cacheItem) {
			// Check if item has expired
			if (this.isExpired(cacheItem)) {
				this.delete(key);

				return false;
			}

			return cacheItem.data;
		}

		return false;
	}

	set(key: string, value: string | Record<string, unknown>, expires?: number): boolean {
		if (!this.isStorable(value)) {
			return false;
		}

		const cacheItem: Record<string, unknown> = {
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

	private isExpired(cacheItem: Record<string, unknown>): boolean {
		if (cacheItem.expires) {
			return cacheItem.expires && Date.now() >= cacheItem.expires;
		}

		return false;
	}
}

export const localCache = new LocalCache();
