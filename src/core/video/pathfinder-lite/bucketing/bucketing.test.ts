import { BucketType } from '../types';

import { checkIfUserInBucket, customCheckIfUserInBucket } from './checkIfUserInBucket';

import { checkForBucketOverlap, validateBucket } from './validation';

jest.mock('@fandom/context', () => ({
	__esModule: true,
	getWikiaBeaconId: jest.fn().mockReturnValue('B'),
}));

jest.mock('../utils/getForcedBucket', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValueOnce('A').mockReturnValueOnce('Z').mockReturnValue(null),
}));

describe('validate checkIfUserInBucket works properly', () => {
	test('should return true when user is the allowed buckets', () => {
		const isUserInBucket = checkIfUserInBucket(['A', 'B', 'C']);

		expect(isUserInBucket).toBe(true);
	});

	test('should return false when bucket is not allowed', () => {
		expect(checkIfUserInBucket(['A', 'B', 'C', 'invalidBucket'])).toBe(false);
	});

	test('should return true when custom bucket is used and is correct', () => {
		// custom buckets for user based on Geo data
		const customGeoBuckets = ['US', 'PL', 'DE', 'FR', 'ES'];

		const isUserInBucket = customCheckIfUserInBucket(
			customGeoBuckets,
			() => /* get GEO from cookie */ 'US',
		);
		expect(isUserInBucket).toBe(true);
	});

	test('should return false when custom bucket is used and is incorrect', () => {
		// custom buckets for user based on Geo data
		const customGeoBuckets = ['US', 'PL', 'DE', 'FR', 'ES'];

		const isUserInBucket = customCheckIfUserInBucket(
			customGeoBuckets,
			() => /* get GEO from cookie */ 'CA',
		);
		expect(isUserInBucket).toBe(false);
	});
});

describe('validation logic functions', () => {
	test('validateBucket returns correct respones (invalid)', () => {
		expect(validateBucket(['!'])).toEqual(BucketType.Invalid);
		expect(validateBucket(['@'])).toEqual(BucketType.Invalid);
	});
	test('validateBucket returns correct respones (control)', () => {
		expect(validateBucket(['a'])).toEqual(BucketType.Control);
		expect(validateBucket(['d'])).toEqual(BucketType.Control);
	});
	test('validateBucket returns correct respones (valid)', () => {
		expect(validateBucket(['0'])).toEqual(BucketType.Valid);
		expect(validateBucket(['h'])).toEqual(BucketType.Valid);
		expect(validateBucket(['F'])).toEqual(BucketType.Valid);
		expect(validateBucket(['_'])).toEqual(BucketType.Valid);
		expect(validateBucket(['CDE', 'JFK'])).toEqual(BucketType.Valid);
	});

	test('checkForBucketOverlap returs correct respones (empty)', () => {
		expect(checkForBucketOverlap(['ghij', 'GHIJ'])).toStrictEqual([]);
	});

	test('checkForBucketOverlap returs correct respones (single value)', () => {
		expect(checkForBucketOverlap(['ghij', 'jkl', 'ABD'])).toStrictEqual(['j']);
	});

	test('checkForBucketOverlap returs correct respones (multiple values)', () => {
		expect(checkForBucketOverlap(['fo', 'baA', 'Az', 'fo'])).toStrictEqual(['A', 'f', 'o']);
	});
});
