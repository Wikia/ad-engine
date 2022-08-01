import { CacheDictionary } from './instant-config-cache-storage';

const KEY_SEPARATOR = '|';
const VALUE_SEPARATOR = ':';

function serializeCache(cache: CacheDictionary): string {
	return Object.keys(cache)
		.map((key) => `${key}:${cache[key]['result']}`)
		.join(KEY_SEPARATOR);
}

function deserializeCache(cache: string): CacheDictionary {
	if (cache === '') return {};

	return cache.split(KEY_SEPARATOR).reduce((serialized, obj) => {
		const [name, value] = obj.split(VALUE_SEPARATOR);
		const result = value === 'true';
		return { ...serialized, [name]: { name, result } };
	}, {}) as CacheDictionary;
}

export { serializeCache, deserializeCache };
