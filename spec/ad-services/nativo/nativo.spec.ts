import { nativo } from '@wikia/ad-services';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';

describe('Nativo service', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.nativo.enabled', true);
		context.set('wiki.opts.enableNativeAds', true);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Nativo is called', async () => {
		await nativo.call();

		expect(
			loadScriptStub.calledWith(
				'https://s.ntv.io/serve/load.js',
				'text/javascript',
				true,
				null,
				{},
				{ ntvSetNoAutoStart: '' },
			),
		).to.equal(true);
	});

	it('Nativo service disabled', async () => {
		context.set('services.nativo.enabled', false);

		await nativo.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Nativo service disabled from backend', async () => {
		context.set('wiki.opts.enableNativeAds', false);

		await nativo.call();

		expect(loadScriptStub.called).to.equal(false);
	});
});
