import sinon, { SinonStubbedInstance } from 'sinon';

class ConnatixPlayerSpy {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	get(playerId: string, renderId: string): void {}
}

export function makeConnatixPlayerSpy(): SinonStubbedInstance<ConnatixPlayerSpy> {
	return sinon.createStubInstance(ConnatixPlayerSpy);
}
