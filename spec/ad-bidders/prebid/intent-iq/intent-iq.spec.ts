import { IntentIQ } from '@wikia/ad-bidders/prebid/intent-iq';
import { context } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';
import { PrebidBidFactory } from '../prebid-bid.factory';

describe('IntentIQ', () => {
	let intentIqNewSpy: SinonSpy;
	let intentIqReportSpy: SinonSpy;
	let contextStub;

	beforeEach(() => {
		intentIqNewSpy = global.sandbox.spy();
		intentIqReportSpy = global.sandbox.spy();
		contextStub = global.sandbox
			.stub(context, 'get')
			.withArgs('bidders.prebid.intentIQ')
			.returns(true)
			.withArgs('bidders.prebid.auctionDelay')
			.returns(50);

		window.IntentIqObject = function IntentIqMock(config) {
			intentIqNewSpy(config);

			config?.callback?.();

			return {
				intentIqConfig: {
					abTesting: {
						currentTestGroup: 'A',
					},
				},
				reportExternalWin: intentIqReportSpy,
			};
		} as unknown as IntentIqObject;
	});

	afterEach(() => {
		global.sandbox.restore();
	});

	describe('reportExternalWin', () => {
		it('should not report external win when IntentIQ is disabled', async () => {
			contextStub.withArgs('bidders.prebid.intentIQ').returns(false);
			const intentIQ = new IntentIQ();

			await intentIQ.reportPrebidWin({} as PrebidBidResponse);

			expect(intentIqReportSpy.notCalled).to.be.true;
		});

		it('should report external win when IntentIQ is enabled and consents are given', async () => {
			contextStub.withArgs('options.trackingOptIn').returns(true);

			const bid = PrebidBidFactory.getBid({
				adId: 'ad-123',
				bidderCode: 'appnexus',
				auctionId: '1234-5678',
				cpm: 0.12,
				currency: 'USD',
				originalCpm: 0.12,
				originalCurrency: 'USD',
				adUnitCode: 'top_leaderboard',
				adserverTargeting: { hb_adid: 'ad-123', hb_pb: '0.12' },
			});

			const intentIQ = new IntentIQ();
			await intentIQ.load();

			await intentIQ.reportPrebidWin(bid);

			expect(intentIqNewSpy.calledOnce).to.be.true;
			expect(
				intentIqReportSpy.calledOnceWithExactly({
					biddingPlatformId: 1,
					bidderCode: 'appnexus',
					prebidAuctionId: '1234-5678',
					cpm: 0.12,
					currency: 'USD',
					originalCpm: 0.12,
					originalCurrency: 'USD',
					status: 'available',
					placementId: 'top_leaderboard',
				}),
			).to.be.true;
		});
	});
});
