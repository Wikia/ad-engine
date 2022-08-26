import { eyeota } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, tcf, utils } from '../../../src/ad-engine/index';

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

		context.set('services.eyeota.enabled', undefined);
		context.set('options.trackingOptIn', undefined);
		context.set('options.optOutSale', undefined);
		context.set('wiki.targeting.directedAtChildren', undefined);
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
		const src = await eyeota.createScriptSource();

		expect(src).to.equal(
			'https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&gdpr=1&gdpr_consent=test&t=ajs',
		);
	});
});
