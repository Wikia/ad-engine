import { Wunderkind } from '@wikia/ad-services';
import { communicationService, EventOptions } from '@wikia/communication';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('Wunderkind', () => {
	let loadScriptStub, instantConfigStub, contextStub, communicationServiceStub;
	let wunderkind: Wunderkind;

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		contextStub = global.sandbox.stub(context);
		communicationServiceStub = global.sandbox.stub(communicationService);

		wunderkind = new Wunderkind(instantConfigStub);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
	});

	it('Wunderkind is disabled', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icWunderkind').returns(false);

		wunderkind.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Wunderkind does not load script if user is logged', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icWunderkind').returns(true);
		contextStub.get.withArgs('state.isLogged').returns(true);

		wunderkind.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Wunderkind does not load script if UAP is loaded', async () => {
		prepareUAPevent(true);
		instantConfigStub.get.withArgs('icWunderkind').returns(true);
		contextStub.get.withArgs('state.isLogged').returns(false);

		wunderkind.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Wunderkind is ready', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icWunderkind').returns(true);
		contextStub.get.withArgs('state.isLogged').returns(false);

		wunderkind.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	function prepareUAPevent(isLoaded: boolean) {
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: isLoaded };
				callback(payload);
			},
		);
	}
});
