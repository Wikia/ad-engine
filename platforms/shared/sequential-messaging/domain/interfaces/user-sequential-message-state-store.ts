import { UserSequentialMessageState } from '../data-structures/user-sequential-message-state';

export interface UserSequentialMessageStateStore {
	set(name: string, userSequentialMessageState: UserSequentialMessageState): void;
}
