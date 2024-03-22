// @ts-strict-ignore
import { UserSequentialMessageState } from '@wikia/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';
import { UserSequentialMessageStateStoreInterface } from '@wikia/platforms/shared/sequential-messaging/domain/interfaces/user-sequential-message-state-store.interface';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

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
