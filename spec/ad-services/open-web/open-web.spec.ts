import { OpenWeb } from '@wikia/ad-services';
import { communicationService, EventOptions } from '@wikia/communication';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';
import { UcpDesktopBuilder, UcpMobileBuilder } from '../../../src';

describe('OpenWeb', () => {
	let loadScriptStub, instantConfigStub, contextStub, communicationServiceStub;
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

		service = new OpenWeb(instantConfigStub);
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

	it('OpenWeb does not load script without builder', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

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

	it('OpenWeb does not load script if there is not enough boxes for mobile-builder', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		service.setPlacementBuilder(new UcpMobileBuilder()).call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('OpenWeb does not load script if it is control group in experiment', () => {
		prepareUAPevent(false);
		contextStub.get.withArgs('templates.openWebReactionsExperiment').returns(true);

		service.setPlacementBuilder(new UcpMobileBuilder()).call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('OpenWeb does load script for mobile-builder', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		const div = document.createElement('div');
		div.classList.add('testing-boxad');
		global.sandbox
			.stub(document, 'querySelectorAll')
			.withArgs('div[class*="-boxad"]')
			.returns([div, div, div, div]);

		service.setPlacementBuilder(new UcpMobileBuilder()).call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('OpenWeb does load script for desktop-builder', async () => {
		prepareUAPevent(false);
		instantConfigStub.get.withArgs('icOpenWeb').returns(fakeActiveConfigValue);
		contextStub.get.withArgs('state.isLogged').returns(false);

		const div = document.createElement('div');
		global.sandbox
			.stub(document, 'querySelector')
			.withArgs('#WikiaAdInContentPlaceHolder')
			.returns(div);

		service.setPlacementBuilder(new UcpDesktopBuilder()).call();

		expect(loadScriptStub.called).to.equal(true);
	});
});
