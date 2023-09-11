import { IntentIQ } from '@wikia/ad-bidders/prebid/intent-iq';
import { context, targetingService, utils } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';
import { PrebidBidFactory } from '../prebid-bid.factory';

describe('IntentIQ', () => {
	let pbjsStub: PbjsStub;
	let intentIqNewSpy: SinonSpy;
	let intentIqReportSpy: SinonSpy;
	let loadScriptStub: SinonStub;
	let contextStub;

	const testResultData = {
		eids: [
			{
				uids: [
					{
						ext: {
							stype: 'ppuid',
						},
						id: '12341234',
					},
				],
				source: 'intentiq.com',
			},
		],
	};

	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		loadScriptStub = global.sandbox.stub(utils.scriptLoader, 'loadScript').resolvesThis();
		intentIqNewSpy = global.sandbox.spy();
		intentIqReportSpy = global.sandbox.spy();
		contextStub = global.sandbox
			.stub(context, 'get')
			.withArgs('bidders.prebid.intentIQ')
			.returns(true)
			.withArgs('services.intentIq.ppid.enabled')
			.returns(true)
			.withArgs('services.intentIq.ppid.tracking.enabled')
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

	describe('load', () => {
		it('should not load when IntentIQ is disabled', async () => {
			contextStub.withArgs('bidders.prebid.intentIQ').returns(false);
			const intentIQ = new IntentIQ();

			await intentIQ.load();

			expect(loadScriptStub.notCalled).to.be.true;
			expect(intentIqNewSpy.notCalled).to.be.true;
		});

		it('should initialize when IntentIQ is enabled and consents are given', async () => {
			contextStub.withArgs('options.trackingOptIn').returns(true);
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');
			const intentIQ = new IntentIQ();

			await intentIQ.load();

			expect(loadScriptStub.calledOnce).to.be.true;
			expect(intentIqNewSpy.calledOnce).to.be.true;
			expect(
				intentIqNewSpy.calledWithMatch({
					partner: 1187275693,
					pbjs: pbjsStub,
					timeoutInMillis: 50,
					ABTestingConfigurationSource: 'percentage',
					abPercentage: 97,
					manualWinReportEnabled: true,
					browserBlackList: 'Chrome',
				}),
				'3',
			).to.be.true;
			expect(targetingServiceStub.calledWithExactly('intent_iq_group', 'A'), '4').to.be.true;
			expect(targetingServiceStub.calledWithExactly('intent_iq_ppid_group', 'A'), '5').to.be.true;
		});
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

	describe('setupPpid', () => {
		it('should quit ppid setup when IntentIQ data is incorrect', () => {
			const intentIQ = new IntentIQ();
			const getPpidSpy = global.sandbox.spy(intentIQ, 'getPpid');

			intentIQ.setupPpid({});

			expect(getPpidSpy.notCalled).to.be.true;
		});

		it('should quit ppid setup when IntentIQ is disabled', () => {
			contextStub.withArgs('bidders.prebid.intentIQ').returns(false);
			const intentIQ = new IntentIQ();
			const getPpidSpy = global.sandbox.spy(intentIQ, 'getPpid');

			intentIQ.setupPpid(testResultData);

			expect(getPpidSpy.notCalled).to.be.true;
		});

		it('should not call setPpid when IIQ PPID is disabled', () => {
			contextStub.withArgs('services.intentIq.ppid.enabled').returns(false);

			const intentIQ = new IntentIQ();
			const setPpidSpy = global.sandbox.spy(intentIQ, 'setPpid');

			intentIQ.setupPpid(testResultData);

			expect(setPpidSpy.notCalled).to.be.true;
		});

		it('should call setPpid when IIQ PPID is enabled', () => {
			const intentIQ = new IntentIQ();
			global.sandbox.stub(intentIQ, 'isEnabled').returns(true);
			const setPpidSpy = global.sandbox.spy(intentIQ, 'setPpid');
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');

			intentIQ.setupPpid(testResultData);

			expect(setPpidSpy.calledOnce).to.be.true;
			expect(setPpidSpy.calledWithExactly('12341234')).to.be.true;
			expect(targetingServiceStub.calledWithExactly('intent_iq_ppid', '12341234', 'intent_iq')).to
				.be.true;
		});

		it('should not send tracking events when IIQ PPID tracking is disabled', () => {
			contextStub.withArgs('services.intentIq.ppid.tracking.enabled').returns(false);

			const intentIQ = new IntentIQ();
			global.sandbox.stub(intentIQ, 'isEnabled').returns(true);
			const trackPpidSpy = global.sandbox.spy(intentIQ, 'trackPpid');

			intentIQ.setupPpid(testResultData);

			expect(trackPpidSpy.notCalled).to.be.true;
		});

		it('should send tracking events when IIQ PPID tracking is enabled', () => {
			const intentIQ = new IntentIQ();
			global.sandbox.stub(intentIQ, 'isEnabled').returns(true);
			const trackPpidSpy = global.sandbox.spy(intentIQ, 'trackPpid');

			intentIQ.setupPpid(testResultData);

			expect(trackPpidSpy.calledOnce).to.be.true;
			expect(trackPpidSpy.calledWithExactly('12341234')).to.be.true;
		});

		it('PPID-related key-val is not being set when IntentIQ PPID is disabled', async () => {
			contextStub.withArgs('services.intentIq.ppid.enabled').returns(false);
			const intentIQ = new IntentIQ();
			const trackPpidSpy = global.sandbox.spy(intentIQ, 'trackPpid');

			await intentIQ.load();

			expect(trackPpidSpy.calledOnce).to.be.false;
		});
	});

	describe('getPpid', () => {
		it('getPpid returns correct PPID when data input is correct ', () => {
			const intentIQ = new IntentIQ();
			const ppid = intentIQ.getPpid(testResultData);
			expect(ppid).to.equal('12341234');
		});

		it('getPpid does not return ppid when data input does not contain source=intentiq.com', () => {
			const intentIQ = new IntentIQ();
			const testData = {
				eids: [
					{
						uids: [
							{
								ext: {
									stype: 'ppuid',
								},
								id: '12341234',
							},
						],
						source: 'different.com',
					},
				],
			};
			const ppid = intentIQ.getPpid(testData);
			expect(ppid).to.be.null;
		});
	});
});
