import { JWPlayerManager, VastResponseData, VastTaglessRequest } from '@wikia/ad-products';
import { Optimizely } from '@wikia/ad-services';
import { communicationService } from '@wikia/communication';
import { context, InstantConfigService } from '@wikia/core';
import { PlayerSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('PlayerSetup', () => {
	let dispatch: SinonSpy;
	let instantConfigStub;
	let jwpManagerStub;
	let vastTaglessRequestStub;
	let subject: PlayerSetup;

	before(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		jwpManagerStub = global.sandbox.createStubInstance(JWPlayerManager);
		vastTaglessRequestStub = { getVast: () => Promise.resolve(undefined) };
		subject = new PlayerSetup(
			instantConfigStub,
			null,
			new Optimizely(),
			jwpManagerStub,
			vastTaglessRequestStub as VastTaglessRequest,
		);
		context.set('src', 'test');
		context.set('slots.featured.videoAdUnit', '/5441/test/vast/ad/unit');
		context.set('options.wad.blocking', false);
		context.set('options.video.displayAndVideoAdsSyncEnabled', true);
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('src');
		context.remove('slots.featured.videoAdUnit');
		context.remove('options.video.vastXml');
		context.remove('options.wad.blocking');
	});

	it('should dispatch jwpSetup action without VAST XML when tagless request is not enabled', () => {
		context.set('src', 'test');
		context.set('slots.featured.videoAdUnit', '/5441/test/vast/ad/unit');
		context.set('options.video.displayAndVideoAdsSyncEnabled', false);
		const expectedDispatchArg = {
			showAds: true,
			autoplayDisabled: false,
			vastXml: undefined,
			type: '[Ad Engine] Setup JWPlayer',
			__global: true,
		};
		vastTaglessRequestStub.getVast = () => Promise.resolve(undefined);
		dispatch = global.sandbox.spy(communicationService, 'dispatch');

		subject.call();

		expect(dispatch.withArgs(expectedDispatchArg).calledOnce);
	});

	it('should dispatch jwpSetup action with VAST XML when tagless request is enabled', () => {
		const mockedVastXML =
			'<?xml version="1.0" encoding="UTF-8"?><VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="4.0"></VAST>';
		const response: VastResponseData = { xml: mockedVastXML, lineItemId: '', creativeId: '' };

		const expectedDispatchArg = {
			showAds: true,
			autoplayDisabled: false,
			vastXml: mockedVastXML,
			type: '[Ad Engine] Setup JWPlayer',
			__global: true,
		};

		vastTaglessRequestStub.getVast = () => Promise.resolve(response);
		dispatch = global.sandbox.spy(communicationService, 'dispatch');

		subject.call();

		expect(dispatch.withArgs(expectedDispatchArg).calledOnce);
	});

	it('should dispatch jwpSetup action with showAds flag and without VAST XML when adblock detected', () => {
		context.set('options.wad.blocking', true);

		const expectedDispatchArg = {
			showAds: false,
			autoplayDisabled: false,
			type: '[Ad Engine] Setup JWPlayer',
			__global: true,
		};

		dispatch = global.sandbox.spy(communicationService, 'dispatch');

		subject.call();

		expect(dispatch.withArgs(expectedDispatchArg).calledOnce);
		expect(dispatch.lastCall.args[0].showAds).to.be.false;
		expect(dispatch.lastCall.args[0].vastXml).to.be.undefined;
	});
});
