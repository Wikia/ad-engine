import { expect } from 'chai';
import { queryString } from '../../../src/ad-engine/utils';

describe('query-string', () => {
	it('parse truthy boolean value from string', () => {
		expect(queryString.parseValue('true')).to.equal(true);
	});

	it('parse falsy boolean value from string', () => {
		expect(queryString.parseValue('false')).to.equal(false);
	});

	it('parse number value from string', () => {
		expect(queryString.parseValue('123')).to.equal(123);
	});

	it('parse numbers array value from string', () => {
		expect(queryString.parseValue('[4,8,15,16,23,42]')).to.deep.equal([4, 8, 15, 16, 23, 42]);
	});

	it('parse string value from string', () => {
		expect(queryString.parseValue('foo')).to.equal('foo');
	});

	it('parse strings array value from string', () => {
		expect(queryString.parseValue('["foo","bar"]')).to.deep.equal(['foo', 'bar']);
	});

	it('parse json value from string', () => {
		expect(queryString.parseValue('{"this":{"is":"json"}}')).to.deep.equal({
			this: { is: 'json' },
		});
	});
});
