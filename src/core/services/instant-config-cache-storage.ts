import { communicationService, eventsRepository } from '@ad-engine/communication';
import { InstantConfigCacheStorageService } from '@wikia/instant-config-loader';
import { CookieStorageAdapter } from './cookie-storage-adapter';
import { deserializeCache, serializeCache } from './instant-config-cache-storage-serializer';
import { UniversalStorage } from './universal-storage';

export interface CacheDictionary {
	[key: string]: CacheData;
}

export interface CacheData {
	name: string;
	group: 'A' | 'B';
	limit: number;
	result: boolean;
	withCookie?: boolean;
}

export class InstantConfigCacheStorage implements InstantConfigCacheStorageService {
	private static instance: InstantConfigCacheStorage;

	static make(): InstantConfigCacheStorage {
		if (!InstantConfigCacheStorage.instance) {
			InstantConfigCacheStorage.instance = new InstantConfigCacheStorage();
		}

		return InstantConfigCacheStorage.instance;
	}

	private readonly cookieStorage = new UniversalStorage(new CookieStorageAdapter());
	private cacheStorage: CacheDictionary;
	private readonly cacheKey = 'basset';

	private constructor() {
		this.resetCache();
	}

	resetCache(): void {
		const serializedCache = this.cookieStorage.getItem<string>(this.cacheKey) || '';
		this.cacheStorage = deserializeCache(serializedCache);
		communicationService.emit(eventsRepository.AD_ENGINE_INSTANT_CONFIG_CACHE_RESET);
	}

	get(id: string): CacheData {
		return this.cacheStorage[id];
	}

	set(data: CacheData): void {
		this.cacheStorage[data.name] = data;

		if (data.withCookie) {
			communicationService.on(eventsRepository.AD_ENGINE_CONSENT_READY, ({ gdprConsent }) => {
				if (gdprConsent) {
					this.synchronizeCookie();
				}
			});
		}
	}

	private synchronizeCookie(): void {
		const cacheDictionaryWithCookie: CacheDictionary = Object.keys(this.cacheStorage)
			.map((key) => ({
				key,
				value: this.cacheStorage[key],
			}))
			.filter(({ value }) => value.withCookie)
			.reduce((result, { key, value }) => ({ ...result, [key]: value }), {});

		const cacheToSave = serializeCache(cacheDictionaryWithCookie);
		this.cookieStorage.setItem(this.cacheKey, cacheToSave);
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
			.map(([, geo]: string[]) => geo);
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
