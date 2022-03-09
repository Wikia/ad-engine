import { UserSequentialMessageState } from '../data-structures/user-sequential-message-state';

export interface UserSequentialMessageStateStoreInterface {
	set(userSequentialMessageState: UserSequentialMessageState): void;
	get(): UserSequentialMessageState;
	// [Multi SM]  At this time we are going to have only one ongoing campaign that is why we are deleting the entire SM cookie
	// to fully support multiple sequences running in parallel this will have to be update to remove a single sequence by id
	delete();
}
