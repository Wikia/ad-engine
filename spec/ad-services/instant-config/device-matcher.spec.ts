import { utils } from '@wikia/ad-engine';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/device-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Device Matcher', () => {
	let getDeviceTypeStub: sinon.SinonStub;
	let deviceMatcher: DeviceMatcher;

	beforeEach(() => {
		getDeviceTypeStub = sinon.stub(utils.client, 'getDeviceType');
	});

	afterEach(() => {
		getDeviceTypeStub.restore();
	});

	describe('desktop', () => {
		beforeEach(() => {
			getDeviceTypeStub.returns('desktop');
			deviceMatcher = new DeviceMatcher();
		});

		it('should work for empty', () => {
			expect(deviceMatcher.isProperDevice()).to.be.true;
			expect(deviceMatcher.isProperDevice([])).to.be.true;
		});

		it('should work for desktop', () => {
			expect(deviceMatcher.isProperDevice(['desktop'])).to.be.true;
		});

		it('should not work for non-desktop', () => {
			expect(deviceMatcher.isProperDevice(['non-desktop'])).to.be.false;
		});

		it('should not work for non-smartphone', () => {
			expect(deviceMatcher.isProperDevice(['non-smartphone'])).to.be.true;
		});

		it('should not work for complex non', () => {
			expect(deviceMatcher.isProperDevice(['non-desktop', 'non-smartphone'])).to.be.false;
			expect(deviceMatcher.isProperDevice(['non-smartphone', 'non-desktop'])).to.be.false;
		});

		it('should work for complex non', () => {
			expect(deviceMatcher.isProperDevice(['non-tablet', 'non-smartphone'])).to.be.true;
		});
	});
});
