import { Bidders } from '@wikia/ad-bidders';
import { A9Provider } from '@wikia/ad-bidders/a9';
import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context, targetingService } from '@wikia/core';
import { expect } from 'chai';

describe('Bidders', () => {
	describe('getName', () => {
		it('should return name', () => {
			const bidders = new Bidders();
			expect(bidders.getName()).to.equal('bidders');
		});
	});

	describe('isEnabled', () => {
		it('should not be enabled when prebid nor A9 is enabled', () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.enabled')
				.returns(false)
				.withArgs('bidders.prebid.enabled')
				.returns(false);
			const bidders = new Bidders();
			expect(bidders.isEnabled()).to.be.false;
		});

		it('should be enabled when prebid is enabled', () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.prebid.enabled').returns(true);
			const bidders = new Bidders();
			expect(bidders.isEnabled()).to.be.true;
		});

		it('should be enabled when A9 is enabled', () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.a9.enabled').returns(true);
			const bidders = new Bidders();
			expect(bidders.isEnabled()).to.be.true;
		});
	});

	describe('applyTargetingParams', () => {
		it('should apply targeting params using targetingService', () => {
			const setStub = global.sandbox.stub(targetingService, 'set');
			const bidders = new Bidders();
			bidders.applyTargetingParams('slot1', { key: 'value' });
			expect(setStub.calledOnceWithExactly('key', 'value', 'slot1')).to.be.true;
		});
	});

	describe('call', () => {
		it('should resolve when no bidder providers are enabled', () => {
			const a9CallStub = global.sandbox.stub(A9Provider.prototype, 'call');
			const prebidCallStub = global.sandbox.stub(PrebidProvider.prototype, 'call');

			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders')
				.returns({
					a9: {
						enabled: false,
					},
					prebid: {
						enabled: false,
					},
				});
			const bidders = new Bidders();
			return bidders
				.call()
				.then(() => {
					expect(a9CallStub.called).to.equal(false, 'should not call A9 provider');
					expect(prebidCallStub.called).to.equal(false, 'should not call prebid provider');
				})
				.catch(() => {
					expect(true).to.be.false;
				});
		});
	});
});
