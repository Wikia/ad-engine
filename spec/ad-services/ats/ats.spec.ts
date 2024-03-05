import { Ats } from '@wikia/ad-services/ats';
import { context, utils } from '@wikia/core';
import { expect } from 'chai';
import Cookies from 'js-cookie';

describe('ATS', () => {
	let ats;
	let loadScriptStub;
	let setAdditionalDataSpy;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		setAdditionalDataSpy = global.sandbox.spy();

		window.ats = {
			setAdditionalData: setAdditionalDataSpy,
		};

		context.set('bidders.liveRampATS.enabled', true);
		context.set('options.optOutSale', false);
		context.set('options.trackingOptIn', true);
		context.set('options.options.geoRequiresConsent', false);
		context.set('state.isLogged', true);

		window.ads = {
			...window.ads,
			context: {
				// @ts-expect-error provide only partial context
				opts: {
					userEmailHashes: ['md5', 'sha1', 'sha256'],
				},
			},
		};
		window.fandomContext = {
			...window.fandomContext,
			partners: {
				directedAtChildren: false,
			},
		};

		ats = new Ats();
	});

	afterEach(() => {
		delete window.ads;
		window.fandomContext.partners = {};
		global.sandbox.restore();
	});

	it('ATS.js is called', async () => {
		global.sandbox.stub(Cookies, 'get').returns('1YNN');

		await ats.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(setAdditionalDataSpy.called).to.equal(true);
		expect(setAdditionalDataSpy.args[0][0]).to.deep.equal({
			consentType: 'ccpa',
			consentString: '1YNN',
			type: 'emailHashes',
			id: ['sha1', 'sha256', 'md5'],
		});
	});

	it('ATS is disabled by feature flag', async () => {
		context.set('bidders.liveRampATS.enabled', false);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is disabled if user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is disabled on child-directed wiki', async () => {
		window.fandomContext.partners.directedAtChildren = true;

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('ATS is not loaded when there is no user email in context', async () => {
		window.ads = {
			...window.ads,
			// @ts-expect-error provide only partial context
			context: {},
		};

		await ats.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
