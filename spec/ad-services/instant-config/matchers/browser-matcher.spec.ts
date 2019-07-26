import { utils } from '@wikia/ad-engine';
import { BrowserMatcher } from '@wikia/ad-services/instant-config/matchers/browser-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Browser Matcher', () => {
	let getBrowserStub: sinon.SinonStub;
	let browserMatcher: BrowserMatcher;

	beforeEach(() => {
		getBrowserStub = sinon.stub(utils.client, 'getBrowser');
	});

	afterEach(() => {
		getBrowserStub.restore();
	});

	describe('Chrome 76', () => {
		beforeEach(() => {
			getBrowserStub.returns('Chrome 76');
			browserMatcher = new BrowserMatcher();
		});

		it('should work for empty', () => {
			expect(browserMatcher.isValid()).to.be.true;
			expect(browserMatcher.isValid([])).to.be.true;
		});

		it('should work for chrome', () => {
			expect(browserMatcher.isValid(['chrome'])).to.be.true;
		});

		it('should be case insensitive', () => {
			expect(browserMatcher.isValid(['cHrOme'])).to.be.true;
		});

		it('should not work for non-chrome', () => {
			expect(browserMatcher.isValid(['non-chrome'])).to.be.false;
		});

		it('should work for non-safari', () => {
			expect(browserMatcher.isValid(['non-safari'])).to.be.true;
		});

		it('should not work for complex non', () => {
			expect(browserMatcher.isValid(['non-chrome', 'non-safari'])).to.be.false;
			expect(browserMatcher.isValid(['non-safari', 'non-chrome'])).to.be.false;
		});

		it('should work for complex non', () => {
			expect(browserMatcher.isValid(['non-firefox', 'non-safari'])).to.be.true;
		});
	});
});
