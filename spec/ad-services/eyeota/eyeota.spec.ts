import { Eyeota, parseContextTags } from '@wikia/ad-services';
import {
	context,
	InstantConfigService,
	TargetingService,
	targetingService,
	tcf,
	utils,
} from '@wikia/core';
import {
	FandomContext,
	Site,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { expect } from 'chai';
import { createSandbox, SinonStubbedInstance } from 'sinon';

describe('Eyeota', () => {
	const sandbox = createSandbox();
	let eyeota: Eyeota;
	let loadScriptStub, instantConfigStub, tcfStub;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		window.__tcfapi = window.__tcfapi as WindowTCF;

		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icEyeota').returns(true);
		tcfStub = sandbox.stub(tcf, 'getTCData').returns(Promise.resolve({ tcString: 'test' }) as any);

		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);

		targetingServiceStub = sandbox.stub(targetingService);

		eyeota = new Eyeota(instantConfigStub);
	});

	afterEach(() => {
		instantConfigStub.get.withArgs('icEyeota').returns(undefined);
		sandbox.restore();
		delete window.__tcfapi;

		context.remove('options.trackingOptIn');
		context.remove('options.optOutSale');
		context.remove('wiki.targeting.directedAtChildren');
	});

	it('is called when all requirements are met', async () => {
		await eyeota.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('it can be disabled', async () => {
		instantConfigStub.get.withArgs('icEyeota').returns(undefined);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('constructs proper src', async () => {
		targetingServiceStub.get.withArgs('s0v').returns('lifestyle');
		const src = await eyeota.createScriptSource();

		expect(src).to.equal('https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&t=ajs&s0v=lifestyle');
	});

	it('constructs proper url with context', async () => {
		window.fandomContext = { site: null, page: null } as FandomContext;
		const mockedTags = {
			gnre: ['1', '2', '3'],
			pub: ['test'],
			pform: ['xbox'],
			mpa: ['general'],
			esrb: ['ec'],
		};
		const mockedContext = new FandomContext(
			new Site([], true, 'test', false, mockedTags, null),
			null,
		);
		sandbox.stub(window.fandomContext, 'site').value(mockedContext.site);
		const src = await eyeota.createScriptSource();
		delete window.fandomContext;

		expect(src).to.equal(
			'https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&t=ajs&s0v=undefined&gnre=1&gnre=2&gnre=3&pform=xbox&pub=test',
		);
	});

	it('constructs proper params on GPDR-related geo', async () => {
		tcfStub.restore();
		tcfStub = sandbox
			.stub(tcf, 'getTCData')
			.returns(Promise.resolve({ tcString: 'test', gdprApplies: true }) as any);
		targetingServiceStub.get.withArgs('s0v').returns('lifestyle');

		const src = await eyeota.createScriptSource();

		expect(src).to.equal(
			'https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&t=ajs&s0v=lifestyle&gdpr=1&gdpr_consent=test',
		);
	});

	describe('parseContextTags', () => {
		it('should add params from context tag object', () => {
			const testTags = { gnre: ['1', '2', '3'], tv: ['a'] };

			const testUrl = parseContextTags(testTags);

			expect(testUrl).to.equal('&gnre=1&gnre=2&gnre=3&tv=a');
		});

		it('should encode special characters and spaces', () => {
			const testTags = { pform: ['xbox series x', 'ś'] };

			const testUrl = parseContextTags(testTags);

			expect(testUrl).to.equal('&pform=xbox%20series%20x&pform=%C5%9B');
		});
	});
});
