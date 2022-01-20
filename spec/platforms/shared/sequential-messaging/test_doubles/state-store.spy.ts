import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { UserSequentialMessageStateStoreInterface } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/user-sequential-message-state-store.interface';

class UserStateStoreSpy implements UserSequentialMessageStateStoreInterface {
	set(userSequentialMessageState): void {}
}

export function makeUserStateStoreSpy(): SinonStubbedInstance<UserStateStoreSpy> {
	return createStubInstance(UserStateStoreSpy);
}
