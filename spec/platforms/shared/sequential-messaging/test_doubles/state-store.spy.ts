import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { UserSequentialMessageStateStore } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/user-sequential-message-state-store';

class UserStateStoreSpy implements UserSequentialMessageStateStore {
	set(string, userSequentialMessageState): void {}
}

export function makeUserStateStoreSpy(): SinonStubbedInstance<UserStateStoreSpy> {
	return createStubInstance(UserStateStoreSpy);
}
