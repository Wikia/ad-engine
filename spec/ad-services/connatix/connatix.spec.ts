import { Connatix } from '@wikia/ad-services';
import { communicationService, EventOptions } from '@wikia/communication';
import { CommunicationService } from '@wikia/communication/communication-service';
import { context } from '@wikia/core';
import sinon, { SinonStubbedInstance } from 'sinon';
import { makePlayerInjectorSpy } from './test-doubles/player-injector-spy';

describe('Connatix', () => {
	let communicationServiceStub: SinonStubbedInstance<CommunicationService>;

	beforeEach(() => {
		communicationServiceStub = global.sandbox.stub(communicationService);
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: false };
				callback(payload);
			},
		);
	});

	afterEach(() => {
		global.sandbox.restore();

		context.remove('services.connatix.enabled');
	});

	it('is called when there is no Fan Takeover', async () => {
		context.set('services.connatix.enabled', true);
		const playerInjectorSpy = makePlayerInjectorSpy();

		const connatix = new Connatix(null, null, playerInjectorSpy);
		await connatix.call();

		sinon.assert.calledWith(playerInjectorSpy.insertPlayerContainer, connatix.cid);
	});

	it('is called when there is a Fan Takeover', async () => {
		context.set('services.connatix.enabled', false);
		const playerInjectorSpy = makePlayerInjectorSpy();

		const connatix = new Connatix(null, null, playerInjectorSpy);
		await connatix.call();
		communicationServiceStub.on.callsFake(
			(event: EventOptions, callback: (payload?: any) => void) => {
				const payload = { isLoaded: true };
				callback(payload);
			},
		);

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});

	it('is called when disabled', async () => {
		context.set('services.connatix.enabled', false);
		const playerInjectorSpy = makePlayerInjectorSpy();

		const connatix = new Connatix(null, null, playerInjectorSpy);
		await connatix.call();

		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});
});
