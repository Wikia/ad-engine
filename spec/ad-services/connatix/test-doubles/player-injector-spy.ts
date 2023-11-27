import sinon, { SinonStubbedInstance } from 'sinon';

class PlayerInjectorSpy {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	insertPlayerContainer(cid: string, renderCallback: (error, player) => void): void {}
}

export function makePlayerInjectorSpy(): SinonStubbedInstance<PlayerInjectorSpy> {
	return sinon.createStubInstance(PlayerInjectorSpy);
}
