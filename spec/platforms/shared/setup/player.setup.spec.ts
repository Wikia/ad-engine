import { JWPlayerManager, VastResponseData, VastTaglessRequest } from '@wikia/ad-products';
import { Optimizely } from '@wikia/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';
import { context, displayAndVideoAdsSyncContext, InstantConfigService } from '@wikia/core';
import { PlayerSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonSpy, SinonStubbedInstance } from 'sinon';

describe('PlayerSetup', () => {
	const MOCKED_VAST_AD_UNIT = '/5441/test/vast/ad/unit';

	let dispatchSpy: SinonSpy;
	let instantConfigStub: SinonStubbedInstance<InstantConfigService>;
	let jwpManagerStub: SinonStubbedInstance<JWPlayerManager>;
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
		context.set('options.wad.blocking', false);
		context.set('src', 'test');
		context.set('slots.featured.videoAdUnit', MOCKED_VAST_AD_UNIT);
		context.set('vast.adUnitId', MOCKED_VAST_AD_UNIT);
	});

	beforeEach(() => {
		dispatchSpy = global.sandbox.spy(communicationService, 'dispatch');
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('options.video.vastXml');
		context.remove('options.wad.blocking');
		context.remove('src');
		context.remove('slots.featured.videoAdUnit');
		context.remove('vast.adUnitId');
	});

	it('should dispatch jwpSetup action without VAST XML when tagless request is not enabled', async () => {
		context.set('src', 'test');
		context.set('slots.featured.videoAdUnit', MOCKED_VAST_AD_UNIT);
		context.set('options.video.displayAndVideoAdsSyncEnabled', false);
		const expectedDispatchArg = {
			showAds: true,
			autoplayDisabled: false,
			vastXml: undefined,
			type: '[Ad Engine] Setup JWPlayer',
			__global: true,
		};
		vastTaglessRequestStub.getVast = () => Promise.resolve(undefined);

		await subject.call();

		expect(dispatchSpy.calledOnceWith(expectedDispatchArg)).to.be.true;
	});

	it('should dispatch jwpSetup action with VAST XML when tagless request is enabled', async () => {
		global.sandbox.stub(displayAndVideoAdsSyncContext, 'isSyncEnabled').returns(true);
		global.sandbox.stub(displayAndVideoAdsSyncContext, 'isTaglessRequestEnabled').returns(true);
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

		await subject.call();

		expect(dispatchSpy.calledOnce).to.be.true;
		expect(dispatchSpy.firstCall.args[0]).to.deep.equal(expectedDispatchArg);
	});

	it('should dispatch jwpSetup action with showAds flag and without VAST XML when adblock detected', async () => {
		context.set('options.wad.blocking', true);
		const expectedDispatchArg = {
			showAds: false,
			autoplayDisabled: false,
			type: '[Ad Engine] Setup JWPlayer',
			__global: true,
		};

		await subject.call();

		expect(dispatchSpy.calledOnceWith(expectedDispatchArg)).to.be.true;
		expect(dispatchSpy.firstCall.args[0].showAds).to.be.false;
		expect(dispatchSpy.firstCall.args[0].vastXml).to.be.undefined;
	});

	it('should dispatch video setup action when Connatix is enabled', async () => {
		instantConfigStub.get.withArgs('icConnatixInstream').returns(true);
		context.set('slots.featured.videoAdUnit', MOCKED_VAST_AD_UNIT);
		context.set('vast.adUnitId', MOCKED_VAST_AD_UNIT);
		const slotName = 'featured';
		const expectedDispatchArg = {
			showAds: true,
			autoplayDisabled: false,
			videoAdUnitPath: MOCKED_VAST_AD_UNIT,
			targetingParams: 'experiment_groups=strategy_rules_undefined&pos=featured&rv=1',
			vastXml: undefined,
			type: '[Video] Setup done',
			__global: true,
		};

		await subject.call();
		communicationService.emit(eventsRepository.BIDDERS_BIDDING_DONE, { slotName });

		expect(dispatchSpy.called).to.be.true;
		expect(dispatchSpy.lastCall.args[0]).to.deep.equal(expectedDispatchArg);
	});
});
