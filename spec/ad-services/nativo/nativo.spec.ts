import { libraryUrl, nativo, nativoLoadedEvent } from '@wikia/ad-services';
import { communicationService } from '@wikia/communication';
import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { createHtmlElementStub } from '../../spec-utils/html-element.stub';

describe('Nativo service', () => {
	const sandbox = createSandbox();

	let loadScriptSpy: SinonSpy;
	let dispatchSpy: SinonSpy;
	let ntvCmdPushSpy: SinonSpy;
	let placeholder: HTMLElement | null;

	beforeEach(() => {
		loadScriptSpy = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		placeholder = createHtmlElementStub(sandbox, 'div');

		dispatchSpy = sandbox.spy(communicationService, 'dispatch');
		ntvCmdPushSpy = sandbox.spy(window.ntv.cmd, 'push');

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

		expect(loadScriptSpy.called).to.equal(true);
		expect(dispatchSpy.callCount).to.equal(1);
		expect(dispatchSpy.firstCall.args[0]).to.deep.equal(nativoLoadedEvent({ isLoaded: true }));
	});

	it('Nativo sends request - happy path scenario', () => {
		nativo.requestAd(placeholder);

		expect(ntvCmdPushSpy.callCount).to.equal(1);
	});

	it('Nativo does not send request when service is disabled via instant-config', () => {
		context.set('services.nativo.enabled', false);
		nativo.requestAd(placeholder);

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo does not send request when service is disabled via WikiConfig', () => {
		context.set('wiki.opts.enableNativeAds', false);
		nativo.requestAd(placeholder);

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo does not send request when Fandom test ad is requested', () => {
		sandbox.stub(utils.queryString, 'get').returns('1');
		nativo.requestAd(placeholder);

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo does not send request when no placeholder', () => {
		placeholder = null;

		nativo.requestAd(placeholder);

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo does not send request when Fan Takeover is on a regular page (FITO/SOV ad product)', () => {
		nativo.requestAd(placeholder, { isLoaded: true });

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo does not send request when Roadblock is on FV page (FITO/SOV ad product)', () => {
		context.set('custom.hasFeaturedVideo', true);

		nativo.requestAd(placeholder, { isLoaded: false, adProduct: 'ruap' });

		expect(ntvCmdPushSpy.callCount).to.equal(0);
	});

	it('Nativo sends request when Roadblock is on a regular page', () => {
		context.set('custom.hasFeaturedVideo', false);

		nativo.requestAd(placeholder, { isLoaded: false, adProduct: 'ruap' });

		expect(ntvCmdPushSpy.callCount).to.equal(1);
	});
});
