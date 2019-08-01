import { sessionCookie } from '../services/session-cookie';
import { UniversalStorage } from '../services/universal-storage';

export interface CacheDictionary {
	[key: string]: CacheData;
}

export interface CacheData {
	name: string;
	group: 'A' | 'B';
	limit: number;
	result: boolean;
	withCookie: boolean;
}

class GeoCacheStorage {
	private readonly cookieStorage = new UniversalStorage(sessionCookie);
	private cacheStorage: CacheDictionary;

	constructor() {
		this.resetCache();
	}

	get(id: string): CacheData {
		return this.cacheStorage[id];
	}

	add(data: CacheData, id: string): void {
		this.cacheStorage[id] = data;

		if (data.withCookie) {
			this.synchronizeCookie();
		}
	}

	private synchronizeCookie(): void {
		const cacheDictionaryWithCookie: CacheDictionary = Object.keys(this.cacheStorage)
			.map((key) => ({
				key,
				value: this.cacheStorage[key],
			}))
			.filter(({ key, value }) => value.withCookie)
			.reduce((result, { key, value }) => ({ ...result, [key]: value }), {});

		this.cookieStorage.setItem('basset', cacheDictionaryWithCookie);
	}

	resetCache(): void {
		this.cacheStorage = this.cookieStorage.getItem('basset') || {};
	}

	getSamplingResults(): string[] {
		return Object.keys(this.cacheStorage).map((id) => this.getResultLog(id));
	}

	private getResultLog(id: string): string {
		const entry: CacheData = this.cacheStorage[id];

		return `${entry.name}_${entry.group}_${entry.limit}`;
	}
}

export const geoCacheStorage = new GeoCacheStorage();
