import { DomainMatcher } from '@wikia/ad-services/instant-config/matchers/domain-matcher';
import { expect } from 'chai';

describe('Domain Matcher', () => {
	const domainMatcher = new DomainMatcher();

	before(() => {
		(global as any).window = { location: { hostname: 'example-aaa.com' } };
	});

	it('should work for empty', () => {
		expect(domainMatcher.isProperDomain()).to.be.true;
	});

	it('should work for empty array', () => {
		expect(domainMatcher.isProperDomain([])).to.be.true;
	});

	it('should work for multiple', () => {
		expect(domainMatcher.isProperDomain(['aaa', 'bbb'])).to.be.true;
	});

	it('should work for single', () => {
		expect(domainMatcher.isProperDomain(['aaa'])).to.be.true;
	});

	it('should not work for single', () => {
		expect(domainMatcher.isProperDomain(['bbb'])).to.be.false;
	});
});
