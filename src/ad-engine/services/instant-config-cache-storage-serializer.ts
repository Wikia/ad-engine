import { CacheDictionary } from './instant-config-cache-storage';

const KEY_SEPARATOR = '|';
const VALUE_SEPARATOR = ':';
const CACHE_LENGTH_LIMIT = 5;

function mapCacheKeys(cache: CacheDictionary) {
	return (key: string) => {
		const { name, group, limit, result } = cache[key];
		return `${name}_${group}_${limit}:${result}`;
	};
}

function parseCacheDictionary(cache): CacheDictionary {
	const [key, value] = cache.split(VALUE_SEPARATOR);
	const result = value === 'true';
	const [name, group, limit_string] = key.split('_');
	const limit = parseFloat(limit_string) || undefined;

	return { [name]: { name, group, limit, result } };
}

function serializeCache(cache: CacheDictionary): string {
	return Object.keys(cache)
		.slice(0, CACHE_LENGTH_LIMIT)
		.map(mapCacheKeys(cache))
		.join(KEY_SEPARATOR);
}

function deserializeCache(cache: string): CacheDictionary {
	if (cache === '' || typeof cache !== 'string') return {};

	return cache
		.split(KEY_SEPARATOR)
		.reduce((serialized, obj) => ({ ...serialized, ...parseCacheDictionary(obj) }), {});
}

export { serializeCache, deserializeCache };
