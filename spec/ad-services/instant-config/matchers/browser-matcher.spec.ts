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
			expect(browserMatcher.isProperBrowser()).to.be.true;
			expect(browserMatcher.isProperBrowser([])).to.be.true;
		});

		it('should work for chrome', () => {
			expect(browserMatcher.isProperBrowser(['chrome'])).to.be.true;
		});

		it('should be case insensitive', () => {
			expect(browserMatcher.isProperBrowser(['cHrOme'])).to.be.true;
		});

		it('should not work for non-chrome', () => {
			expect(browserMatcher.isProperBrowser(['non-chrome'])).to.be.false;
		});

		it('should work for non-safari', () => {
			expect(browserMatcher.isProperBrowser(['non-safari'])).to.be.true;
		});

		it('should not work for complex non', () => {
			expect(browserMatcher.isProperBrowser(['non-chrome', 'non-safari'])).to.be.false;
			expect(browserMatcher.isProperBrowser(['non-safari', 'non-chrome'])).to.be.false;
		});

		it('should work for complex non', () => {
			expect(browserMatcher.isProperBrowser(['non-firefox', 'non-safari'])).to.be.true;
		});
	});
});
