import { TargetingManagerInterface } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/targeting-manager.interface';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { SequenceState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

class TargetingManagerSpy implements TargetingManagerInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setTargeting(sequenceId: string, sequenceState: SequenceState): void {}
}

export function makeTargetingManagerSpy(): SinonStubbedInstance<TargetingManagerSpy> {
	return createStubInstance(TargetingManagerSpy);
}
