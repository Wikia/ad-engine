import { BucketType } from '../types';

export const DEFAULT_BUCKET_INDEX = 0;
export const ALLOWED_BUCKET_CHAR = /[0-9a-zA-Z_-]/;
export const ALLOWED_BUCKETS_STRING = /[0-9a-zA-Z_-]+/;

/** Validates whether a bucket isn't a restricted value */
export function validateBucket(buckets: string[]): BucketType {
	if (buckets.map((bucket) => !ALLOWED_BUCKET_CHAR.test(bucket)).some(Boolean)) {
		return BucketType.Invalid;
	}

	return BucketType.Valid;
}

export function validateCustomBucket(validateFunc: () => boolean) {
	if (typeof validateFunc !== 'function') {
		return BucketType.Invalid;
	}

	if (validateFunc()) {
		return BucketType.Valid;
	}

	return BucketType.Invalid;
}

/** Get list of overlapping buckets */
export function checkForBucketOverlap(buckets: Array<string>): Array<string> {
	// no buckets, nothing to do
	if (!buckets?.length) {
		return [];
	}

	// merge all strings, sort, return if we have two or more symbols next to each other, but trim them to 1st character each
	const matches = buckets
		.filter(String)
		.map((bucket) => bucket.split(''))
		.reduce((acc, val) => acc.concat(val), [])
		.sort()
		.join('')
		.match(/(.)\1+/g);

	return matches ? matches.map((match) => match[0]) : [];
}
