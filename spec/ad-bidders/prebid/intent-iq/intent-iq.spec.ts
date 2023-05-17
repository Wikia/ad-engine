import { IntentIQ } from '@wikia/ad-bidders/prebid/intent-iq';
import { context, DEFAULT_MAX_DELAY, targetingService, utils } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';
import { PrebidBidFactory } from '../prebid-bid.factory';

describe('IntentIQ', () => {
	let pbjsStub: PbjsStub;
	let intentIqNewSpy: SinonSpy;
	let intentIqReportSpy: SinonSpy;
	let loadScriptStub: SinonStub;

	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		loadScriptStub = global.sandbox.stub(utils.scriptLoader, 'loadScript').resolvesThis();
		intentIqNewSpy = global.sandbox.spy();
		intentIqReportSpy = global.sandbox.spy();

		window.IntentIqObject = function IntentIqMock(config) {
			intentIqNewSpy(config);

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

	describe('initialize', () => {
		it('should not initialize when IntentIQ is disabled', async () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.prebid.intentIQ').returns(false);
			const intentIQ = new IntentIQ();

			await intentIQ.initialize();

			expect(loadScriptStub.notCalled).to.be.true;
			expect(intentIqNewSpy.notCalled).to.be.true;
		});

		it('should initialize when IntentIQ is enabled and consents are given', async () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.prebid.intentIQ')
				.returns(true)
				.withArgs('options.trackingOptIn')
				.returns(true);
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');
			const intentIQ = new IntentIQ();
			await intentIQ.preloadScript(pbjsStub);

			await intentIQ.initialize();

			expect(loadScriptStub.calledOnce).to.be.true;
			expect(intentIqNewSpy.calledOnce).to.be.true;
			expect(
				intentIqNewSpy.calledWithMatch({
					partner: 1187275693,
					pbjs: pbjsStub,
					timeoutInMillis: DEFAULT_MAX_DELAY,
					ABTestingConfigurationSource: 'percentage',
					abPercentage: 90,
					manualWinReportEnabled: true,
					browserBlackList: 'Chrome',
				}),
			).to.be.true;
			expect(targetingServiceStub.calledOnceWithExactly('intent_iq_group', 'A')).to.be.true;
		});
	});

	describe('reportExternalWin', () => {
		it('should not report external win when IntentIQ is disabled', async () => {
			global.sandbox.stub(context, 'get').withArgs('bidders.prebid.intentIQ').returns(false);
			const intentIQ = new IntentIQ();

			await intentIQ.reportPrebidWin('top_leaderboard', {});

			expect(intentIqReportSpy.notCalled).to.be.true;
		});

		it('should report external win when IntentIQ is enabled and consents are given', async () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.prebid.intentIQ')
				.returns(true)
				.withArgs('options.trackingOptIn')
				.returns(true);
			pbjsStub.getBidResponsesForAdUnitCode.returns({
				bids: [
					PrebidBidFactory.getBid({
						adId: 'ad-123',
						bidderCode: 'appnexus',
						auctionId: '1234-5678',
						cpm: 0.123,
						currency: 'USD',
						originalCpm: 0.123,
						originalCurrency: 'USD',
						adUnitCode: 'top_leaderboard',
					}),
				],
			});

			const intentIQ = new IntentIQ();
			await intentIQ.preloadScript(pbjsStub);
			await intentIQ.initialize();

			await intentIQ.reportPrebidWin('top_leaderboard', {
				hb_adid: 'ad-123',
			});

			expect(intentIqNewSpy.calledOnce).to.be.true;
			expect(pbjsStub.getBidResponsesForAdUnitCode.calledOnce).to.be.true;
			expect(
				intentIqReportSpy.calledOnceWithExactly({
					biddingPlatformId: 1,
					bidderCode: 'appnexus',
					prebidAuctionId: '1234-5678',
					cpm: 0.123,
					currency: 'USD',
					originalCpm: 0.123,
					originalCurrency: 'USD',
					status: 'available',
					placementId: 'top_leaderboard',
				}),
			).to.be.true;
		});
	});
});
