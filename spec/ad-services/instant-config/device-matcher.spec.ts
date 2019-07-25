import { utils } from '@wikia/ad-engine';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/device-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Device Matcher', () => {
	let clientStub: sinon.SinonStub;
	let deviceMatcher: DeviceMatcher;

	beforeEach(() => {
		clientStub = sinon.stub(utils.client, 'getDeviceType');
	});

	afterEach(() => {
		clientStub.restore();
	});

	describe('desktop', () => {
		beforeEach(() => {
			clientStub.returns('desktop');
			deviceMatcher = new DeviceMatcher();
		});

		it('should work for empty', () => {
			expect(deviceMatcher.isProperDevice()).to.be.true;
			expect(deviceMatcher.isProperDevice([])).to.be.true;
		});

		it('should work for desktop', () => {
			expect(deviceMatcher.isProperDevice(['desktop'])).to.be.true;
		});

		it('should not work  non-desktop', () => {
			expect(deviceMatcher.isProperDevice(['non-desktop'])).to.be.false;
		});

		it('should not work for non-smartphone', () => {
			expect(deviceMatcher.isProperDevice(['non-smartphone'])).to.be.true;
		});

		it('should not work complex non', () => {
			expect(deviceMatcher.isProperDevice(['non-desktop', 'non-smartphone'])).to.be.false;
			expect(deviceMatcher.isProperDevice(['non-smartphone', 'non-desktop'])).to.be.false;
		});

		it('should work complex non', () => {
			expect(deviceMatcher.isProperDevice(['non-tablet', 'non-smartphone'])).to.be.true;
		});
	});
});
