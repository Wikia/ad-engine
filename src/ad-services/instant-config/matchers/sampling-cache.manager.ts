import { InstantConfigSamplingCache } from '../instant-config.models';

export class SamplingCacheManager {
	apply(id: string, cache: InstantConfigSamplingCache, predicate: () => boolean): boolean {
		// if is in the cookie
		// // return value from cookie

		const value = predicate();

		// if sampling
		// // sample

		// if cache
		// // cache

		return value;
	}
}
