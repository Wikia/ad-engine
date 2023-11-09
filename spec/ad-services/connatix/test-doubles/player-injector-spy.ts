import sinon, { SinonStubbedInstance } from 'sinon';

class PlayerInjectorSpy {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	insertPlayerContainer(cid: string): void {}
}

export function makePlayerInjectorSpy(): SinonStubbedInstance<PlayerInjectorSpy> {
	return sinon.createStubInstance(PlayerInjectorSpy);
}
