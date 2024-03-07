import { Bidders } from '@wikia/ad-bidders';
import { A9Provider } from '@wikia/ad-bidders/a9';
import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context, InstantConfigService, targetingService } from '@wikia/core';
import { expect } from 'chai';

describe('Bidders', () => {
	let instantConfigStub;

	before(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
	});

	after(() => {
		targetingService.clear();
	});

	describe('getName', () => {
		it('should return name', () => {
			const bidders = new Bidders(instantConfigStub, null);
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
			const bidders = new Bidders(instantConfigStub, null);
			expect(bidders.isEnabled()).to.be.false;
		});

		it('should be enabled when prebid is enabled', () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.prebid.enabled').returns(true);
			const bidders = new Bidders(instantConfigStub, null);
			expect(bidders.isEnabled()).to.be.true;
		});

		it('should be enabled when A9 is enabled', () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.a9.enabled').returns(true);
			const bidders = new Bidders(instantConfigStub, null);
			expect(bidders.isEnabled()).to.be.true;
		});
	});

	describe('applyTargetingParams', () => {
		it('should apply targeting params using targetingService', () => {
			const setStub = global.sandbox.stub(targetingService, 'set');
			const bidders = new Bidders(instantConfigStub, null);
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
			const bidders = new Bidders(instantConfigStub, null);
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

		it('should call all enabled bidderProviders', () => {
			global.sandbox.stub(A9Provider.prototype, 'callBids').callsFake((cb) => {
				cb();
			});
			global.sandbox.stub(PrebidProvider.prototype, 'callBids').callsFake((cb) => {
				cb();
			});
			global.sandbox.stub(A9Provider.prototype, 'hasResponse').returns(true);
			global.sandbox.stub(PrebidProvider.prototype, 'hasResponse').returns(true);
			const a9CallStub = global.sandbox.stub(A9Provider.prototype, 'call').callThrough();
			const prebidCallStub = global.sandbox.stub(PrebidProvider.prototype, 'call').callThrough();

			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders')
				.returns({
					a9: {
						enabled: true,
						amazonId: '12345',
						slots: {
							top_leaderboard: {
								type: 'display',
								sizes: [[728, 90]],
							},
						},
					},
					prebid: {
						enabled: true,
					},
				})
				.withArgs('bidders.prebid')
				.returns({})
				.withArgs('bidders.a9.enabled')
				.returns(true)
				.withArgs('bidders.coppaA9')
				.returns(false);

			const bidders = new Bidders(instantConfigStub, null);
			return bidders
				.call()
				.then(() => {
					expect(a9CallStub.calledOnce).to.equal(true, 'should call A9 provider');
					expect(prebidCallStub.calledOnce).to.equal(true, 'should call prebid provider');
				})
				.catch(() => {
					expect(true).to.be.false;
				});
		});
	});
});
