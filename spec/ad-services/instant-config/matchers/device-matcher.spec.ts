import { utils } from '@wikia/ad-engine';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/matchers/device-matcher';
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
			expect(deviceMatcher.isValid()).to.be.true;
			expect(deviceMatcher.isValid([])).to.be.true;
		});

		it('should work for desktop', () => {
			expect(deviceMatcher.isValid(['desktop'])).to.be.true;
		});

		it('should not work for non-desktop', () => {
			expect(deviceMatcher.isValid(['non-desktop'])).to.be.false;
		});

		it('should work for non-smartphone', () => {
			expect(deviceMatcher.isValid(['non-smartphone'])).to.be.true;
		});

		it('should not work for complex non', () => {
			expect(deviceMatcher.isValid(['non-desktop', 'non-smartphone'])).to.be.false;
			expect(deviceMatcher.isValid(['non-smartphone', 'non-desktop'])).to.be.false;
		});

		it('should work for complex non', () => {
			expect(deviceMatcher.isValid(['non-tablet', 'non-smartphone'])).to.be.true;
		});
	});
});
