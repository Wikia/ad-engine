import { UserSequentialMessageState } from '../data-structures/user-sequential-message-state';

export interface UserSequentialMessageStateStoreInterface {
	set(userSequentialMessageState: UserSequentialMessageState): void;
	get(): UserSequentialMessageState;
	delete();
}
