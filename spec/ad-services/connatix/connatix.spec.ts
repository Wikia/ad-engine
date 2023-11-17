import { Connatix } from '@wikia/ad-services';
import { ConnatixTracker } from '@wikia/ad-services/connatix/connatix-tracker';
import { communicationService, EventOptions } from '@wikia/communication';
import { CommunicationService } from '@wikia/communication/communication-service';
import { context } from '@wikia/core';
import sinon, { SinonStubbedInstance } from 'sinon';
import { makePlayerTrackerSpy } from './test-doubles/connatix-tracker-spy';
import { makePlayerInjectorSpy } from './test-doubles/player-injector-spy';

describe('Connatix', () => {
	let communicationServiceStub: SinonStubbedInstance<CommunicationService>;

	beforeEach(() => {
		communicationServiceStub = global.sandbox.stub(communicationService);
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: false, adProduct: 'nothing' };
				callback(payload);
			},
		);
	});

	afterEach(() => {
		global.sandbox.restore();

		context.remove('services.connatix.enabled');
		context.remove('services.connatix.cid');
	});

	it('is called when there is no Fan Takeover', async () => {
		context.set('services.connatix.enabled', true);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.calledWith(playerInjectorSpy.insertPlayerContainer, connatix.cid);
	});

	it('is called when there is a Fan Takeover', async () => {
		context.set('services.connatix.enabled', false);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: true, adProduct: 'vuap' };
				callback(payload);
			},
		);

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});

	it('is called when there is a roadblock on the page', async () => {
		context.set('services.connatix.enabled', false);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: false, adProduct: 'ruap' };
				callback(payload);
			},
		);

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});

	it('is called when disabled', async () => {
		context.set('services.connatix.enabled', false);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});

	it('is called when not really enabled or disabled', async () => {
		context.set('services.connatix.enabled', null);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});

	it('is called when enabled but does not insert player without cid defined', async () => {
		context.set('services.connatix.enabled', true);
		context.set('services.connatix.cid', null);
		const playerInjectorSpy = makePlayerInjectorSpy();
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});
});
