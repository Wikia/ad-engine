import { SequenceState } from '../data-structures/user-sequential-message-state';

export interface TargetingManagerInterface {
	setTargeting(sequenceId: string, sequenceState: SequenceState): void;
}
