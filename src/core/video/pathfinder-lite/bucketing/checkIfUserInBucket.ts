import { getCurrentBucket } from './getCurrentBucket';
import { ALLOWED_BUCKET_CHAR } from './validation';

/** Checks weather the user's current bucket identifier is in the allowed defined buckets */
export function checkIfUserInBucket(allowedBuckets: string[]): boolean {
	if (allowedBuckets.map((bucket) => !ALLOWED_BUCKET_CHAR.test(bucket)).some(Boolean)) {
		return false;
	}

	const userBucket = getCurrentBucket();
	return allowedBuckets.some((bucket) => bucket === userBucket);
}

export function customCheckIfUserInBucket<T>(
	allowedBuckets: Array<T>,
	getUserbucket: () => T,
): boolean {
	// return early if no custom function is defined
	if (typeof getUserbucket !== 'function') {
		return false;
	}

	const userBucket = getUserbucket();
	return allowedBuckets.some((bucket) => bucket === userBucket);
}
