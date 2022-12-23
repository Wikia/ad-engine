import { parseContextTags, eyeota } from '@wikia/ad-services';
import {
	FandomContext,
	Site,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, tcf, utils } from '@wikia/core/index';

describe('Eyeota', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		window.__tcfapi = window.__tcfapi as WindowTCF;

		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));

		sandbox.stub(tcf, 'getTCData').returns(Promise.resolve({ tcString: 'test' }) as any);
		context.set('services.eyeota.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
		context.remove('services.eyeota.enabled');
		delete window.__tcfapi;

		context.remove('services.eyeota.enabled');
		context.remove('options.trackingOptIn');
		context.remove('options.optOutSale');
		context.remove('wiki.targeting.directedAtChildren');
	});

	it('is called when all requirements are met', async () => {
		await eyeota.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('it can be disabled', async () => {
		context.set('services.eyeota.enabled', false);

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
		context.set('targeting.s0v', 'lifestyle');
		const src = await eyeota.createScriptSource();

		expect(src).to.equal('https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&t=ajs&s0v=lifestyle');

		context.remove('targeting.s0v');
	});

	it('constructs proper url with context', async () => {
		window.fandomContext = { site: null, page: null } as FandomContext;
		const mockedTags = { gnre: ['1', '2', '3'], pub: ['test'], pform: ['xbox'] };
		const mockedContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedTags, null, 'general'),
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
		sandbox.restore();
		sandbox
			.stub(tcf, 'getTCData')
			.returns(Promise.resolve({ tcString: 'test', gdprApplies: true }) as any);
		context.set('targeting.s0v', 'lifestyle');

		const src = await eyeota.createScriptSource();

		expect(src).to.equal(
			'https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&t=ajs&s0v=lifestyle&gdpr=1&gdpr_consent=test',
		);

		context.remove('targeting.s0v');
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
