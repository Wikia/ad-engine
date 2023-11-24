import { Connatix } from '@wikia/ad-services';
import { ConnatixTracker } from '@wikia/ad-services/connatix/connatix-tracker';
import { communicationService, EventOptions } from '@wikia/communication';
import { CommunicationService } from '@wikia/communication/communication-service';
import { context } from '@wikia/core';
import sinon, { SinonStubbedInstance } from 'sinon';
import { makePlayerTrackerSpy } from './test-doubles/connatix-tracker-spy';
import { makePlayerApiSpy } from './test-doubles/player-api-spy';
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

	it('is inserted when there is no Fan Takeover', async () => {
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
		sinon.assert.called(playerTrackerSpy.trackInit);
	});

	it('is not inserted when there is a Fan Takeover', async () => {
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
		sinon.assert.notCalled(playerTrackerSpy.trackInit);
	});

	it('is not inserted when there is a roadblock on the page', async () => {
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
		sinon.assert.notCalled(playerTrackerSpy.trackInit);
	});

	it('is not inserted when disabled', async () => {
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
		sinon.assert.notCalled(playerTrackerSpy.trackInit);
	});

	it('is not inserted when not really enabled or disabled', async () => {
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

	it('is inserted when there is no Fan Takeover and sends tracking of ready event', async () => {
		context.set('services.connatix.enabled', true);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		// @ts-ignore unit tests purposes only
		playerInjectorSpy.insertPlayerContainer = (cid, renderCallback) => {
			renderCallback(null, makePlayerApiSpy());
		};
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.called(playerTrackerSpy.trackInit);
		sinon.assert.called(playerTrackerSpy.trackReady);
	});

	it('is inserted when there is no Fan Takeover but stops when there is an error', async () => {
		context.set('services.connatix.enabled', true);
		context.set('services.connatix.cid', 'abcdefghi123');
		const playerInjectorSpy = makePlayerInjectorSpy();
		// @ts-ignore unit tests purposes only
		playerInjectorSpy.insertPlayerContainer = (cid, renderCallback) => {
			renderCallback('Error!', makePlayerApiSpy());
		};
		const playerTrackerSpy = makePlayerTrackerSpy();

		const connatix = new Connatix(
			null,
			null,
			playerInjectorSpy,
			playerTrackerSpy as unknown as ConnatixTracker,
		);
		await connatix.call();

		sinon.assert.called(playerTrackerSpy.trackInit);
		sinon.assert.notCalled(playerTrackerSpy.trackReady);
	});
});
