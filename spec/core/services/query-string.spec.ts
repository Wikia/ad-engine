import { queryString } from '@wikia/core/utils';
import { expect } from 'chai';

describe('query-string', () => {
	describe('parseValue', () => {
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

	describe('getURLSearchParams', () => {
		beforeEach(() => {
			global.sandbox.stub(window, 'location').value({ search: '?first=value1&second=value2' });
		});

		it('should use window.location and return URLSearchParams object', () => {
			const searchParams = queryString.getURLSearchParams();

			expect(searchParams.get('first')).to.equal('value1');
			expect(searchParams.get('second')).to.equal('value2');
		});

		it('should use input and return URLSearchParams object', () => {
			const input = '?custom=value';
			const searchParams = queryString.getURLSearchParams(input);

			expect(searchParams.get('first')).to.equal(null);
			expect(searchParams.get('second')).to.equal(null);
			expect(searchParams.get('custom')).to.equal('value');
		});
	});
});
