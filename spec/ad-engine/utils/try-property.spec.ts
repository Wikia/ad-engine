import { tryProperty, whichProperty } from '@wikia/ad-engine/utils';
import { expect } from 'chai';

const testProperties = ['a', 'b', 'c'];

describe('tryProperty', () => {
	it('should return undefined if object is null', async () => {
		const testObject = null;
		expect(tryProperty(testObject, testProperties)).to.be.undefined;
	});

	it('should return a function if the property is found', async () => {
		const testObject = { a: () => {} };
		expect(typeof tryProperty(testObject, testProperties) === 'function').to.be.true;
	});

	it('should return the property value is not a function', async () => {
		const testObject = { a: '?' };
		expect(tryProperty(testObject, testProperties)).to.be.equal(testObject.a);
	});

	it('should return undefined if property is found', async () => {
		const testObject = { d: () => {} };
		expect(tryProperty(testObject, testProperties)).to.be.undefined;
	});
});

describe('whichProperty', () => {
	it('should return undefined if object is null', async () => {
		const testObject = null;
		expect(whichProperty(testObject, testProperties)).to.be.undefined;
	});

	it('should return found property name', async () => {
		const testObject = { a: () => {} };
		expect(whichProperty(testObject, testProperties)).to.be.equal('a');
	});
});
