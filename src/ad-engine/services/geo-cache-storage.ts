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

	resetCache(): void {
		sessionCookie.readSessionId();
		this.cacheStorage = this.cookieStorage.getItem('basset') || {};
	}

	get(id: string): CacheData {
		return this.cacheStorage[id];
	}

	set(data: CacheData): void {
		this.cacheStorage[data.name] = data;

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

	/**
	 * Transform sampling results using supplied key-values map.
	 */
	mapSamplingResults(keyVals: string[] = []): string[] {
		if (!keyVals || !keyVals.length) {
			return [];
		}

		const labradorVariables: string[] = this.getSamplingResults();

		return keyVals
			.map((keyVal: string) => keyVal.split(':'))
			.filter(([lineId]: string[]) => labradorVariables.includes(lineId))
			.map(([lineId, geo]: string[]) => geo);
	}

	getSamplingResults(): string[] {
		return Object.keys(this.cacheStorage).map((id) => this.getResultLog(id));
	}

	private getResultLog(id: string): string {
		const entry: CacheData = this.cacheStorage[id];
		const name: string = this.removeIndexSuffix(entry.name);

		return `${name}_${entry.group}_${entry.limit}`;
	}

	private removeIndexSuffix(name: string): string {
		const nameHyphenIndex: number = name.lastIndexOf('-');

		return nameHyphenIndex !== -1 ? name.substring(0, nameHyphenIndex) : name;
	}
}

export const geoCacheStorage = new GeoCacheStorage();
