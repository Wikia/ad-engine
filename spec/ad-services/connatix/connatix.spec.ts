import { Connatix } from '@wikia/ad-services';
import { context } from '@wikia/core';
import sinon from 'sinon';
import { makePlayerInjectorSpy } from './test-doubles/player-injector-spy';
import { makeScriptLoaderSpy } from './test-doubles/script-loader-spy';

describe('Connatix', () => {
	it('Connatix is called', async () => {
		context.set('services.connatix.enabled', true);
		const playerInjectorSpy = makePlayerInjectorSpy();
		const sLoader = makeScriptLoaderSpy();

		const connatix = new Connatix(null, null, sLoader, playerInjectorSpy);
		await connatix.call();

		sinon.assert.calledOnce(sLoader.loadScript);
		sinon.assert.calledWith(playerInjectorSpy.insertPlayerContainer, connatix.cid);
	});

	it('Connatix is disabled', async () => {
		context.set('services.connatix.enabled', false);
		const sLoader = makeScriptLoaderSpy();
		const playerInjectorSpy = makePlayerInjectorSpy();

		const connatix = new Connatix(null, null, sLoader, playerInjectorSpy);
		await connatix.call();

		sinon.assert.notCalled(sLoader.loadScript);
		sinon.assert.notCalled(playerInjectorSpy.insertPlayerContainer);
	});
});
