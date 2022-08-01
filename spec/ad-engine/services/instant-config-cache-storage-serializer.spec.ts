import { expect } from 'chai';
import {
	deserializeCache,
	serializeCache,
} from '@wikia/ad-engine/services/instant-config-cache-storage-serializer';
import { CacheDictionary } from '@wikia/ad-engine';

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
			'icOutstreamExperiment-0': {
				name: 'icOutstreamExperiment-0',
				result: true,
				withCookie: true,
				group: 'B',
				limit: 40,
			},
		} as CacheDictionary;

		const result = serializeCache(testObject);

		const expectedResult = 'icUAPJWPlayer-0_A_99:false|icOutstreamExperiment-0_B_40:true';
		expect(result).to.equal(expectedResult);
	});

	it('should serialize an empty object as empty string', () => {
		const testObject = {} as CacheDictionary;

		const result = serializeCache(testObject);

		const expectedResult = '';
		expect(result).to.equal(expectedResult);
	});

	it('should deserialize the object', () => {
		const testObject = 'icUAPJWPlayer-0_A_99.99:false|icOutstreamExperiment-0_B_01:true';

		const result = deserializeCache(testObject);

		const expectedResult = {
			'icUAPJWPlayer-0': {
				group: 'A',
				limit: 99.99,
				name: 'icUAPJWPlayer-0',
				result: false,
			},
			'icOutstreamExperiment-0': {
				group: 'B',
				limit: 1,
				name: 'icOutstreamExperiment-0',
				result: true,
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
});
