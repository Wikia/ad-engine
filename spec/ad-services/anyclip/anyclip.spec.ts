import { Anyclip } from '@wikia/ad-services';
import { EventOptions, eventsRepository } from '@wikia/communication';
import {
	communicationService,
	CommunicationService,
} from '@wikia/communication/communication-service';
import { context, targetingService, TargetingService, utils } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import { expect } from 'chai';
import sinon, { SinonStubbedInstance } from 'sinon';

describe('Anyclip', () => {
	let anyclip: Anyclip;
	let mockedIsApplicable;
	const mockIsApplicable = () => true;
	const mockIsNotApplicable = () => false;

	let loadScriptStub;
	let communicationServiceStub: SinonStubbedInstance<CommunicationService>;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
		loadScriptStub = global.sandbox.spy(utils.scriptLoader, 'loadScript');
		mockedIsApplicable = global.sandbox.spy();
		anyclip = new Anyclip();

		context.set('custom.hasFeaturedVideo', false);
		context.set('services.anyclip.enabled', true);
		context.set('services.anyclip.loadWithoutAnchor', true);

		communicationServiceStub = global.sandbox.stub(communicationService);
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: false };
				callback(payload);
			},
		);
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		global.sandbox.restore();

		context.remove('custom.hasFeaturedVideo');
		context.remove('services.anyclip.enabled');
		context.remove('services.anyclip.loadWithoutAnchor');
		context.remove('services.anyclip.isApplicable');
		context.remove('services.anyclip.pubname');
		context.remove('services.anyclip.widgetname');
	});

	it('does not load the player when disabled', () => {
		context.set('services.anyclip.enabled', false);
		context.set('services.anyclip.isApplicable', mockedIsApplicable);

		anyclip.call();
		expect(mockedIsApplicable.called).to.equal(false);
	});

	it('loads the script when isApplicable is not a function', () => {
		anyclip.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('loads the script when isApplicable is a function and returns true', () => {
		context.set('services.anyclip.isApplicable', mockIsApplicable);

		anyclip.call();
		expect(loadScriptStub.called).to.equal(true);
	});

	it('does not load the script when isApplicable is a function and returns false', () => {
		context.set('services.anyclip.isApplicable', mockIsNotApplicable);

		anyclip.call();
		expect(loadScriptStub.called).to.equal(false);
	});

	it('does not load the player when it is supposed to wait for UAP load event that never happens', () => {
		context.set('services.anyclip.loadWithoutAnchor', false);
		context.set('services.anyclip.isApplicable', mockedIsApplicable);

		anyclip.call();
		expect(mockedIsApplicable.calledThrice).to.equal(false);
	});

	it('tracks "eligible" event', () => {
		context.set('services.anyclip.loadWithoutAnchor', false);
		context.set('custom.hasIncontentPlayer', true);
		context.set('services.anyclip.playerElementId', 'incontent_player');

		anyclip.call();

		expect(
			communicationServiceStub.emit.calledWithMatch(
				eventsRepository.VIDEO_PLAYER_TRACKING,
				sinon.match({ eventInfo: sinon.match({ event_name: 'eligible' }) }),
			),
		).to.equal(true);
	});

	it('sets up the Anyclip params based on the context', () => {
		context.set('services.anyclip.pubname', 'test-pubname');
		context.set('services.anyclip.widgetname', 'test-widget');

		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.equal({
			pubname: 'test-pubname',
			widgetname: 'test-widget',
		});
	});

	it('sets up widgetname under the key named after the current vertical', () => {
		targetingServiceStub.get.withArgs('s0v').returns('anime');
		context.set('services.anyclip.widgetname', { anime: 'anime-widget' });

		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.include({
			widgetname: 'anime-widget',
		});
	});

	it("sets up widgetname under the 'default' key when the current vertical isn't mapped to any specific widgetname", () => {
		targetingServiceStub.get.withArgs('s0v').returns('games');
		context.set('services.anyclip.widgetname', { default: 'test-widget' });

		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.include({
			widgetname: 'test-widget',
		});
	});

	it("sets up the default Anyclip widgetname if there's no default key provided", () => {
		targetingServiceStub.get.withArgs('s0v').returns('games');
		context.set('services.anyclip.widgetname', { anime: 'anime-widget' });

		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.include({
			widgetname: '001w000001Y8ud2_19593',
		});
	});

	it('sets up the default Anyclip params when none is provided via the context', () => {
		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.equal({
			pubname: 'fandomcom',
			widgetname: '001w000001Y8ud2_19593',
		});
	});
});
