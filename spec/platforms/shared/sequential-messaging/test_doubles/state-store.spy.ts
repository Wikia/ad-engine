import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { UserSequentialMessageStateStoreInterface } from '@wikia/platforms/shared/sequential-messaging/domain/interfaces/user-sequential-message-state-store.interface';
import { UserSequentialMessageState } from '@wikia/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

class UserStateStoreSpy implements UserSequentialMessageStateStoreInterface {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	set(userSequentialMessageState): void {}

	get(): UserSequentialMessageState {
		return undefined;
	}

	delete() {}
}

export function makeUserStateStoreSpy(): SinonStubbedInstance<UserStateStoreSpy> {
	return createStubInstance(UserStateStoreSpy);
}
