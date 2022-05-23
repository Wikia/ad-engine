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
	});

	afterEach(() => {
		sandbox.restore();
		context.remove('services.eyeota.enabled');
		delete window.__tcfapi;
	});

	it('Eyeota is called', async () => {
		context.set('services.eyeota.enabled', true);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Eyeota is disabled', async () => {
		context.set('services.eyeota.enabled', false);

		await eyeota.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Construct proper src', async () => {
		const src = await eyeota.createScriptSource();

		expect(src).to.equal('https://ps.eyeota.net/pixel?pid=r8rcb20&sid=fandom&gdpr=1&gdpr_consent=test&t=aj');
	});
});
