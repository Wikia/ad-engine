import { DomainMatcher } from '@wikia/ad-services/instant-config/matchers/domain-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Domain Matcher', () => {
	let hostnameStub: sinon.SinonStub;
	const domainMatcher = new DomainMatcher();

	before(() => {
		hostnameStub = sinon.stub(window, 'location');
		hostnameStub.value({ hostname: 'example-aaa.com' });
	});

	after(() => {
		hostnameStub.restore();
	});

	it('should work for empty', () => {
		expect(domainMatcher.isValid()).to.be.true;
		expect(domainMatcher.isValid([])).to.be.true;
	});

	it('should work for multiple', () => {
		expect(domainMatcher.isValid(['aaa', 'bbb'])).to.be.true;
	});

	it('should work for single', () => {
		expect(domainMatcher.isValid(['aaa'])).to.be.true;
	});

	it('should not work for single', () => {
		expect(domainMatcher.isValid(['bbb'])).to.be.false;
	});
});
