import { Apstag } from '@wikia/ad-bidders';
import { context, targetingService, usp } from '@wikia/core';
import { scriptLoader } from '@wikia/core/utils';
import { OpenRtb2Object } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('Apstag', () => {
	let apstagInitStub: SinonSpy;
	let apstagFetchBidsStub: SinonSpy;
	let apstagRpaStub: SinonSpy;
	let scriptLoaderStub: SinonSpy;
	const amazonId = 12345;

	beforeEach(() => {
		apstagInitStub = global.sandbox.spy();
		apstagFetchBidsStub = global.sandbox.spy();
		apstagRpaStub = global.sandbox.spy();
		global.window.apstag = global.window.apstag || ({} as typeof global.window.apstag);
		global.sandbox.stub(window, 'apstag').value({
			init: apstagInitStub,
			fetchBids: apstagFetchBidsStub,
			rpa: apstagRpaStub,
		});
		scriptLoaderStub = global.sandbox.spy();
		global.sandbox.stub(scriptLoader, 'loadScript').callsFake((src, defer, node) => {
			scriptLoaderStub(src, defer, node);
			return Promise.resolve(undefined);
		});
		context.set('bidders.a9.amazonId', amazonId);
	});

	afterEach(() => {
		context.remove('bidders.a9.amazonId');
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
			expect(apstagInitStub.calledOnce).to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					signals: { ortb2: {} },
				}),
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
			expect(apstagInitStub.calledOnce).to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					params: {
						us_privacy: uspString,
					},
					signals: { ortb2: {} },
				}),
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
			expect(apstagInitStub.calledOnce).to.be.true;
			expect(
				apstagInitStub.calledWithExactly({
					pubID: amazonId,
					videoAdServer: 'DFP',
					deals: true,
					signals: { ortb2 },
				}),
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
				.returns(true);

			// when
			await apstag.init();

			// then
			expect(
				apstagRpaStub.calledWithExactly({ hashedRecords: [{ type: 'email', record: 'hash3' }] }),
			).to.be.true;
		});
	});

	describe('sendHEM', () => {
		it('should send provided HEM once', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox.stub(context, 'get').withArgs('bidders.a9.hem.enabled').returns(true);
			global.sandbox
				.stub(apstag.storage, 'getItem')
				.onFirstCall()
				.returns(undefined)
				.onSecondCall()
				.returns('1');

			// when
			await apstag.sendHEM('hash');
			await apstag.sendHEM('hash');

			// then
			expect(apstagRpaStub.callCount).to.equal(1);
			expect(
				apstagRpaStub.calledWithExactly({ hashedRecords: [{ type: 'email', record: 'hash' }] }),
			).to.be.true;
		});

		it('should not send HEM when feature flag is disabled', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox.stub(context, 'get').withArgs('bidders.a9.hem.enabled').returns(false);

			// when
			await apstag.sendHEM('hash');

			// then
			expect(apstagRpaStub.notCalled).to.be.true;
		});

		it('should not send HEM when it was already sent to Amazon', async () => {
			// given
			const apstag = Apstag.reset();
			global.sandbox.stub(apstag.storage, 'getItem').returns('1');

			// when
			await apstag.sendHEM('hash');

			// then
			expect(apstagRpaStub.notCalled).to.be.true;
		});
	});
});
