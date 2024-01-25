import { OpenWeb, PlacementsBuilder, PlacementsHandler } from '@wikia/ad-services';
import { communicationService, EventOptions } from '@wikia/communication';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';

describe('OpenWeb', () => {
	let loadScriptStub,
		instantConfigStub,
		contextStub,
		communicationServiceStub,
		placementHandlerBuildStub,
		placementHandlerIsReadyStub;
	let service: OpenWeb;
	const fakeActiveConfigValue = {
		isActive: true,
		spotId: 'testSpotId',
	};

	beforeEach(() => {
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		contextStub = global.sandbox.stub(context);
		communicationServiceStub = global.sandbox.stub(communicationService);

		placementHandlerIsReadyStub = global.sandbox
			.stub(PlacementsHandler.prototype, 'isDone')
			.returns(true);
		placementHandlerBuildStub = global.sandbox.stub(PlacementsHandler.prototype, 'build');

		service = new OpenWeb(instantConfigStub, null, new PlacementsHandler(new PlacementsBuilder()));
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
	});

	function prepareUAPevent(isLoaded: boolean) {
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: isLoaded };
				callback(payload);
			},
		);
	}

	it('OpenWeb is disabled', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(null);

		service.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('OpenWeb does not load script if user is logged', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(true);

		service.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('OpenWeb does not load script if UAP is loaded', async () => {
		prepareUAPevent(true);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		service.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('OpenWeb does load script for mobile-builder', async () => {
		prepareUAPevent(false);

		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		service.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(placementHandlerIsReadyStub.called).to.equal(true);
		expect(placementHandlerBuildStub.called).to.equal(true);
	});

	it('OpenWeb does load script for desktop-builder', async () => {
		prepareUAPevent(false);

		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		service.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(placementHandlerIsReadyStub.called).to.equal(true);
		expect(placementHandlerBuildStub.called).to.equal(true);
	});
});
