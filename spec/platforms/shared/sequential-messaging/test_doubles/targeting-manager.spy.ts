import { TargetingManagerInterface } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/targeting-manager-interface';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class TargetingManagerSpy implements TargetingManagerInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setTargeting(adTargeting): void {}
}

export function makeTargetingManagerSpy(): SinonStubbedInstance<TargetingManagerSpy> {
	return createStubInstance(TargetingManagerSpy);
}
