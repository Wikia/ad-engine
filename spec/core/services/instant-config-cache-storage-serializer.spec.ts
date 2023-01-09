import { CacheDictionary } from '@wikia/core';
import {
	deserializeCache,
	serializeCache,
} from '@wikia/core/services/instant-config-cache-storage-serializer';
import { expect } from 'chai';

describe('serialize/deserialize cache object', () => {
	it('should serialize the object', () => {
		const testObject = {
			'icUAPJWPlayer-0': {
				name: 'icUAPJWPlayer-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
		} as CacheDictionary;

		const result = serializeCache(testObject);

		const expectedResult = 'icUAPJWPlayer-0_A_99:false';
		expect(result).to.equal(expectedResult);
	});

	it('should serialize an empty object as empty string', () => {
		const testObject = {} as CacheDictionary;

		const result = serializeCache(testObject);

		const expectedResult = '';
		expect(result).to.equal(expectedResult);
	});

	it('should deserialize the object', () => {
		const testObject = 'icUAPJWPlayer-0_A_99.99:false';

		const result = deserializeCache(testObject);

		const expectedResult = {
			'icUAPJWPlayer-0': {
				group: 'A',
				limit: 99.99,
				name: 'icUAPJWPlayer-0',
				result: false,
			},
		};
		expect(result).to.deep.equal(expectedResult);
	});

	it('should deserialize an empty string as empty object', () => {
		const testObject = '';

		const result = deserializeCache(testObject);

		const expectedResult = {};
		expect(result).to.deep.equal(expectedResult);
	});

	it('should not deserialize invalid object', () => {
		const testObject = {};

		// @ts-ignore old Basset cookie is an object, which breaks the new implementation
		const result = deserializeCache(testObject);

		const expectedResult = {};
		expect(result).to.deep.equal(expectedResult);
	});

	it('should drop objects above length limit', () => {
		const testObject = {
			'one-0': {
				name: 'one-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
			'two-0': {
				name: 'two-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
			'three-0': {
				name: 'three-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
			'four-0': {
				name: 'four-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
			'five-0': {
				name: 'five-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
			'six-0': {
				name: 'six-0',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 99,
			},
		} as CacheDictionary;

		const result = serializeCache(testObject);

		expect(result).to.not.contain('six');
	});
});
