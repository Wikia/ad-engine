import { ConnatixPlayerInterface } from '@wikia/ad-services';
import sinon, { SinonStubbedInstance } from 'sinon';

class ConnatixPlayerSpy implements ConnatixPlayerInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	get(playerId: string, renderId: string): void {}
}

export function makeConnatixPlayerSpy(): SinonStubbedInstance<ConnatixPlayerSpy> {
	return sinon.createStubInstance(ConnatixPlayerSpy);
}
