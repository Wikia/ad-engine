import { CacheData, geoCacheStorage } from '@ad-engine/core';
import { InstantConfigSamplingCache } from '../instant-config.models';

export class SamplingCacheManager {
	private readonly geoCacheStorage = geoCacheStorage;
	private readonly precision = 10 ** 6;

	apply(id: string, samplingCache: InstantConfigSamplingCache, predicate: () => boolean): boolean {
		const cached = this.geoCacheStorage.get(id);

		if (typeof cached !== 'undefined') {
			return cached.result;
		}

		const value: boolean = predicate();

		if (typeof samplingCache.sampling !== 'number' || value === false) {
			return value;
		}

		const samplingResult = this.getSamplingResult(samplingCache.sampling);
		const cacheData: CacheData = {
			name: id,
			result: samplingResult,
			withCookie: !!samplingCache.samplingCache,
			group: samplingResult ? 'B' : 'A',
			limit: +(samplingResult ? samplingCache.sampling : 100 - samplingCache.sampling).toFixed(6),
		};

		this.geoCacheStorage.set(cacheData);

		return samplingResult;
	}

	private getSamplingResult(sampling: number): boolean {
		const randomValue: number = Math.round(Math.random() * 100 * this.precision);
		const samplingValue: number = Math.round(sampling * this.precision);

		return samplingValue > randomValue;
	}
}
