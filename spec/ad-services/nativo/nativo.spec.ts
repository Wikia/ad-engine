import { libraryUrl, nativo, nativoLoadedEvent } from '@wikia/ad-services';
import { communicationService } from '@wikia/communication';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';
import { context, utils } from '../../../src/ad-engine';

describe('Nativo service', () => {
	const sandbox = createSandbox();
	let loadScriptSpy: SinonSpy;
	let dispatchSpy: SinonSpy;

	beforeEach(() => {
		loadScriptSpy = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		dispatchSpy = sandbox.spy(communicationService, 'dispatch');
		context.set('services.nativo.enabled', true);
		context.set('wiki.opts.enableNativeAds', true);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Nativo is called', async () => {
		await nativo.call();

		expect(
			loadScriptSpy.calledWith(
				libraryUrl,
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

		expect(loadScriptSpy.called).to.equal(false);
	});

	it('Nativo service disabled from backend', async () => {
		context.set('wiki.opts.enableNativeAds', false);

		await nativo.call();

		expect(loadScriptSpy.called).to.equal(false);
	});

	it('Nativo emits event on successful load', async () => {
		await nativo.call();

		console.log(dispatchSpy.firstCall.args[0]);

		expect(loadScriptSpy.called).to.equal(true);
		expect(dispatchSpy.callCount).to.equal(1);
		expect(dispatchSpy.firstCall.args[0]).to.deep.equal(nativoLoadedEvent({}));
	});
});
