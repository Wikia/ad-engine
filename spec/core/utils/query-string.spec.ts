import { queryString } from '@wikia/core/utils';
import { expect } from 'chai';

describe('query-string', () => {
	describe('isUrlParamSet', () => {
		beforeEach(() => {
			global.sandbox.stub(window, 'location').value({ search: '?first=1&second' });
		});

		it('should return that param is set', () => {
			expect(queryString.isUrlParamSet('first')).to.equal(true);
			expect(queryString.isUrlParamSet('second')).to.equal(false);
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
