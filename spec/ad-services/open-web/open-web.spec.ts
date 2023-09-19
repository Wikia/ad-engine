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
		placementHandlerIsReadyStub,
		spotimDisableAdsStub;
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

		spotimDisableAdsStub = global.sandbox.stub();
		window.__SPOTIM_DISABLE_ADS__ = spotimDisableAdsStub;

		service = new OpenWeb(instantConfigStub, new PlacementsHandler(new PlacementsBuilder()));
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		spotimDisableAdsStub.resetHistory();
		window.__SPOTIM_ADS_DISABLED__ = undefined;
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

	it('OpenWeb does not load script if UAP is loaded on mobile', async () => {
		prepareUAPevent(true);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);
		contextStub.get.withArgs('state.isMobile').returns(true);

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

	it('OpenWeb disables ads if UAP is loaded on desktop', async () => {
		prepareUAPevent(true);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		service.call();

		expect(loadScriptStub.called).to.equal(true);
		expect(window.__SPOTIM_ADS_DISABLED__).to.equal(true);
		expect(spotimDisableAdsStub.called).to.equal(true);
	});
});
