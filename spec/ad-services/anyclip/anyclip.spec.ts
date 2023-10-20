import { Anyclip } from '@wikia/ad-services';
import { EventOptions } from '@wikia/communication';
import {
	communicationService,
	CommunicationService,
} from '@wikia/communication/communication-service';
import { context, utils } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Anyclip', () => {
	let anyclip: Anyclip;
	let mockedIsApplicable;
	const mockIsApplicable = () => true;
	const mockIsNotApplicable = () => false;

	let loadScriptStub;
	let communicationServiceStub: SinonStubbedInstance<CommunicationService>;

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
		expect(mockedIsApplicable.called).to.equal(false);
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

	it('sets up the default Anyclip params when none is provided via the context', () => {
		anyclip = new Anyclip();

		expect(anyclip.params).to.deep.equal({
			pubname: 'fandomcom',
			widgetname: '001w000001Y8ud2_19593',
		});
	});
});
