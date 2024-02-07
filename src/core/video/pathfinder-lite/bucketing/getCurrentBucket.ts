import { getWikiaBeaconId } from '@fandom/context';

import getForcedBucket from '../utils/getForcedBucket';

import { DEFAULT_BUCKET_INDEX } from './validation';

/**
 * Gets the current bucket for user based on the following rules:
 *
 * - If the user is in a forced bucket, return that bucket.
 * - If the user is not in a forced bucket, return the bucket based on `getWikiaBeaconId`.
 */
export function getCurrentBucket(index = DEFAULT_BUCKET_INDEX): string {
	const forcedBucket = getForcedBucket();

	if (typeof forcedBucket !== 'undefined' && forcedBucket?.length > 0) {
		return forcedBucket?.[index];
	}

	const beacon = getWikiaBeaconId() || '0';

	return beacon?.[index];
}
