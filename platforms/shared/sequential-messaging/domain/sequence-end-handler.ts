import { UserSequentialMessageStateStoreInterface } from './interfaces/user-sequential-message-state-store.interface';

export class SequenceEndHandler {
	constructor(private userStateStore: UserSequentialMessageStateStoreInterface) {}

	endSequence() {
		this.userStateStore.delete();
	}
}
