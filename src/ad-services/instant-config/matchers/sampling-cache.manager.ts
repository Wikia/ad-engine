import { sessionCookie, UniversalStorage } from '@ad-engine/core';
import { InstantConfigSamplingCache } from '../instant-config.models';

interface CacheDictionary {
	[key: string]: CacheData;
}

interface CacheData {
	name: string;
	group: 'A' | 'B';
	limit: number;
	result: boolean;
	withCookie: boolean;
}

export class SamplingCacheManager {
	private readonly cookieStorage = new UniversalStorage(sessionCookie);
	private readonly cacheStorage: CacheDictionary;
	private readonly precision = 10 ** 6;

	constructor() {
		this.cacheStorage = this.cookieStorage.getItem('basset') || {};
	}

	apply(id: string, samplingCache: InstantConfigSamplingCache, predicate: () => boolean): boolean {
		if (typeof this.cacheStorage[id] !== 'undefined') {
			return this.cacheStorage[id].result;
		}

		const value = predicate();

		if (typeof samplingCache.sampling !== 'number' || value === false) {
			return value;
		}

		const samplingResult = this.getSamplingResult(samplingCache.sampling);

		const cacheData: CacheData = {
			name: id,
			result: samplingResult,
			withCookie: samplingCache.samplingCache,
			group: samplingResult ? 'B' : 'A',
			limit: samplingResult ? samplingCache.sampling : 100 - samplingCache.sampling,
		};

		// cache
		//

		return samplingResult;
	}

	private getSamplingResult(sampling: number): boolean {
		const randomValue: number = Math.round(Math.random() * 100 * this.precision);
		const samplingValue: number = Math.round(sampling * this.precision);

		return samplingValue > randomValue;
	}
}
