import { Apstag } from '@wikia/ad-bidders';
import { CcpaSignalPayload, GdprConsentPayload } from '@wikia/communication';
import { context, targetingService, usp } from '@wikia/core';
import { scriptLoader } from '@wikia/core/utils';
import { OpenRtb2Object } from '@wikia/platforms/shared';
import { expect } from 'chai';
import Cookies from 'js-cookie';
import { SinonFakeTimers, SinonSpy, useFakeTimers } from 'sinon';

describe('Apstag', () => {
	let apstagInitStub: SinonSpy;
	let apstagFetchBidsStub: SinonSpy;
	let apstagRpaStub: SinonSpy;
	let apstagUpaStub: SinonSpy;
	let apstagDpaStub: SinonSpy;
	let scriptLoaderStub: SinonSpy;
	let clock: SinonFakeTimers;
	const amazonId = 12345;

	beforeEach(() => {
		apstagInitStub = global.sandbox.spy();
		apstagFetchBidsStub = global.sandbox.spy();
		apstagRpaStub = global.sandbox.spy();
		apstagUpaStub = global.sandbox.spy();
		apstagDpaStub = global.sandbox.spy();
		global.window.apstag = global.window.apstag || ({} as typeof global.window.apstag);
		global.sandbox.stub(window, 'apstag').value({
			init: apstagInitStub,
			fetchBids: apstagFetchBidsStub,
			rpa: apstagRpaStub,
			upa: apstagUpaStub,
			dpa: apstagDpaStub,
		});
		scriptLoaderStub = global.sandbox.spy();
		global.sandbox.stub(scriptLoader, 'loadScript').callsFake((src, defer, node) => {
			scriptLoaderStub(src, defer, node);
			return Promise.resolve(undefined);
		});
		context.set('bidders.a9.amazonId', amazonId);
		clock = useFakeTimers({
			now: Date.now(),
			shouldAdvanceTime: true,
			advanceTimeDelta: 650,
			toFake: ['Date', 'setTimeout', 'clearTimeout'],
		});
	});

	afterEach(() => {
		context.remove('bidders.a9.amazonId');
		clock.restore();
	});

	describe('make', () => {
		it('returns single instance of Apstag', () => {
			// given
			const apstag1 = Apstag.make();

			// when
			const apstag2 = Apstag.make();

			// then
			expect(JSON.stringify(apstag1)).to.equal(JSON.stringify(apstag2));
		});

		it('should load apstag.js script', () => {
			// given + when
			Apstag.reset();

			// then
			expect(
				scriptLoaderStub.calledWithExactly('//c.amazon-adsystem.com/aax2/apstag.js', true, 'first'),
			).to.be.true;
		});
	});

	describe('init', () => {
		it('should call window.apstag.init with config', async () => {
			// given
			const apstag = Apstag.reset();

			// when
			await apstag.init();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					gdpr: {
						cmpTimeout: 2000,
					},
					signals: { ortb2: {} },
				}),
				'apstag.init not called with expected args',
			).to.be.true;
		});

		it('should call window.apstag.init with config containing CCPA signal', async () => {
			// given
			const apstag = Apstag.reset();
			const uspString = '1---';
			global.sandbox.stub(usp, 'exists').value(true);
			global.sandbox.stub(usp, 'getSignalData').callsFake(() => Promise.resolve({ uspString }));

			// when
			await apstag.init();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					gdpr: {
						cmpTimeout: 2000,
					},
					params: {
						us_privacy: uspString,
					},
					signals: { ortb2: {} },
				}),
				'apstag.init not called with expected args',
			).to.be.true;
		});

		it('should call window.apstag.init with config containing OpenRTB2 signals', async () => {
			// given
			const apstag = Apstag.reset();
			const ortb2 = {
				site: {
					id: '1234',
				},
				user: {},
			} as OpenRtb2Object;
			global.sandbox.stub(targetingService, 'get').withArgs('openrtb2', 'openrtb2').returns(ortb2);

			// when
			await apstag.init();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					gdpr: {
						cmpTimeout: 2000,
					},
					signals: { ortb2 },
				}),
				'apstag.init not called with expected args',
			).to.be.true;
		});

		it('should cleanup Amazon Token when proper ICBM variable is set', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox.stub(context, 'get').withArgs('bidders.a9.hem.cleanup').returns(true);
			global.sandbox.stub(Cookies, 'get').withArgs('AMZN-Token').returns('token');
			global.sandbox.stub(apstag.storage, 'getItem').withArgs('apstagRecord').returns('Token');

			// when
			await apstag.init();
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(apstagDpaStub.calledOnce, 'apstag.dpa not called').to.be.true;
			expect(apstagRpaStub.notCalled, 'apstag.rpa call not expected').to.be.true;
			expect(apstagUpaStub.notCalled, 'apstag.upa call not expected').to.be.true;
		});

		it('should update optOut HEM to Amazon when user consent changes', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('wiki.opts.userEmailHashes')
				.returns(['hash1', 'hash2', 'hash3'])
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('options.trackingOptIn')
				.returns(true)
				.withArgs('options.optOutSale')
				.returns(false);

			// when
			await apstag.init();
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(apstagRpaStub.calledOnce, 'apstag.rpa not called once').to.be.true;
			expect(
				apstagRpaStub.calledWithExactly({
					hashedRecords: [{ type: 'email', record: 'hash3' }],
					optOut: false,
				}),
				'apstag.rpa not called with expected args',
			).to.be.true;
		});

		it('should send HEM to Amazon when user is logged in', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('wiki.opts.userEmailHashes')
				.returns(['hash1', 'hash2', 'hash3'])
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('options.trackingOptIn')
				.returns(true)
				.withArgs('options.optOutSale')
				.returns(false);

			// when
			await apstag.init();
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagInitStub.calledOnce, 'apstag.init not called').to.be.true;
			expect(apstagRpaStub.calledOnce, 'apstag.rpa not called once').to.be.true;
			expect(
				apstagRpaStub.calledWithExactly({
					hashedRecords: [{ type: 'email', record: 'hash3' }],
					optOut: false,
				}),
				'apstag.rpa not called with expected args',
			).to.be.true;
		});
	});

	describe('sendHEM', () => {
		type UserConsentChangeTestCase = [
			testCase: string,
			previousOptOut: string,
			expectedOptOut: boolean,
			consents: GdprConsentPayload & CcpaSignalPayload,
		];
		const userConsentChangeTestCases: UserConsentChangeTestCase[] = [
			[
				'GDPR - OptIn -> OptOut',
				'0',
				true,
				{
					gdprConsent: false,
					ccpaSignal: false,
					geoRequiresConsent: true,
					geoRequiresSignal: false,
				},
			],
			[
				'GDPR - OptOut -> OptIn',
				'1',
				false,
				{
					gdprConsent: true,
					ccpaSignal: false,
					geoRequiresConsent: true,
					geoRequiresSignal: false,
				},
			],
			[
				'CCPA - OptIn -> OptOut',
				'0',
				true,
				{
					gdprConsent: true,
					ccpaSignal: true,
					geoRequiresConsent: false,
					geoRequiresSignal: true,
				},
			],
			[
				'CCPA - OptOut -> OptIn',
				'1',
				false,
				{
					gdprConsent: true,
					ccpaSignal: false,
					geoRequiresConsent: false,
					geoRequiresSignal: true,
				},
			],
		];

		it('should send provided HEM once', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('bidders.a9.hem.cleanup')
				.returns(false)
				.withArgs('options.trackingOptIn')
				.returns(true)
				.withArgs('options.optOutSale')
				.returns(false);
			global.sandbox
				.stub(apstag.storage, 'getItem')
				.onFirstCall()
				.returns(undefined)
				.onSecondCall()
				.returns(Date.now().toString());

			// when
			// call #1
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();
			// call #2
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagRpaStub.calledOnce, 'apstag.rpa not called once').to.be.true;
			expect(
				apstagRpaStub.calledWithExactly({
					hashedRecords: [{ type: 'email', record: 'hash' }],
					optOut: false,
				}),
				'apstag.rpa not called with expected args',
			).to.be.true;
		});

		it('should renew Amazon Token when it expired', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('bidders.a9.hem.cleanup')
				.returns(false)
				.withArgs('options.trackingOptIn')
				.returns(true)
				.withArgs('options.optOutSale')
				.returns(false);
			global.sandbox
				.stub(apstag.storage, 'getItem')
				.withArgs('apstagHEMsent', true)
				.returns((Date.now() - 24 * 60 * 60 * 1000).toString());

			// when
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagRpaStub.calledOnce, 'apstag.rpa not called once').to.be.true;
			expect(
				apstagRpaStub.calledWithExactly({
					hashedRecords: [{ type: 'email', record: 'hash' }],
					optOut: false,
				}),
				'apstag.rpa not called with expected args',
			).to.be.true;
		});

		userConsentChangeTestCases.forEach(([testCase, previousOptOut, expectedOptOut, consents]) => {
			it(`should update Amazon Token when user consent changes - ${testCase}`, async () => {
				// given
				const apstag = Apstag.reset();
				global.sandbox
					.stub(context, 'get')
					.withArgs('bidders.a9.hem.enabled')
					.returns(true)
					.withArgs('bidders.a9.hem.cleanup')
					.returns(false);
				global.sandbox
					.stub(apstag.storage, 'getItem')
					.withArgs('apstagHEMsent', true)
					.returns(Date.now().toString())
					.withArgs('apstagHEMoptOut', true)
					.returns(previousOptOut);

				// when
				await apstag.sendHEM('hash', consents);
				// proceed time as workaround debounce decorator
				await clock.nextAsync();

				// then
				expect(apstagUpaStub.calledOnce, 'apstag.upa not called once').to.be.true;
				expect(
					apstagUpaStub.calledWithExactly({
						hashedRecords: [{ type: 'email', record: 'hash' }],
						optOut: expectedOptOut,
					}),
					'apstag.upa not called with expected args',
				).to.be.true;
			});
		});

		it('should not send HEM when feature flag is disabled', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.hem.enabled')
				.returns(false)
				.withArgs('bidders.a9.hem.cleanup')
				.returns(false);

			// when
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagRpaStub.notCalled, 'apstag.rpa call not expected').to.be.true;
		});

		it('should not send HEM when it was already sent to Amazon and not expired', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('bidders.a9.hem.cleanup')
				.returns(false);
			global.sandbox
				.stub(apstag.storage, 'getItem')
				.withArgs('apstagHEMsent', true)
				.returns((Date.now() + Apstag.AMAZON_TOKEN_TTL).toString());

			// when
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagRpaStub.notCalled, 'apstag.rpa call not expected').to.be.true;
		});

		it('should not send HEM when cleanup feature flag is enabled', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox
				.stub(context, 'get')
				.withArgs('bidders.a9.hem.enabled')
				.returns(true)
				.withArgs('bidders.a9.hem.cleanup')
				.returns(true);

			// when
			await apstag.sendHEM('hash');
			// proceed time as workaround debounce decorator
			await clock.nextAsync();

			// then
			expect(apstagRpaStub.notCalled, 'apstag.rpa call not expected').to.be.true;
		});
	});
});
