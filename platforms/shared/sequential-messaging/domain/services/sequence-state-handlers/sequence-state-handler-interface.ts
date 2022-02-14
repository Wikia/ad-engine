import { Sequence } from '../../data-structures/sequence';

export interface SequenceStateHandlerInterface {
	handleState(sequence: Sequence);
}
