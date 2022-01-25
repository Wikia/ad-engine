import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { UserSequentialMessageStateStoreInterface } from '../../../../../platforms/shared/sequential-messaging/domain/interfaces/user-sequential-message-state-store.interface';

class UserStateStoreSpy implements UserSequentialMessageStateStoreInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	set(userSequentialMessageState): void {}

	get(): any {
		return undefined;
	}

	delete() {}
}

export function makeUserStateStoreSpy(): SinonStubbedInstance<UserStateStoreSpy> {
	return createStubInstance(UserStateStoreSpy);
}
