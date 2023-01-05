import { SequenceState } from '@wikia/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';
import { TargetingManagerInterface } from '@wikia/platforms/shared/sequential-messaging/domain/interfaces/targeting-manager.interface';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

class TargetingManagerSpy implements TargetingManagerInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	setTargeting(sequenceId: string, sequenceState: SequenceState): void {}
}

export function makeTargetingManagerSpy(): SinonStubbedInstance<TargetingManagerSpy> {
	return createStubInstance(TargetingManagerSpy);
}
