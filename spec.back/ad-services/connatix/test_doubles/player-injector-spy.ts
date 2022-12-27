import { PlayerInjectorInterface } from '@wikia/ad-services/connatix/player-injector';
import sinon, { SinonStubbedInstance } from 'sinon';

class PlayerInjectorSpy implements PlayerInjectorInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	insertPlayerContainer(cid: string): void {}
}

export function makePlayerInjectorSpy(): SinonStubbedInstance<PlayerInjectorSpy> {
	return sinon.createStubInstance(PlayerInjectorSpy);
}
