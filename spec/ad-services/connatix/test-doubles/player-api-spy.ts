import sinon, { SinonStubbedInstance } from 'sinon';

class PlayerApiSpy {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	on(eventName: string, callback: (eventData: unknown) => void): void {}
}

export function makePlayerApiSpy(): SinonStubbedInstance<PlayerApiSpy> {
	return sinon.createStubInstance(PlayerApiSpy);
}
