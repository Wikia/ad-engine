export interface SequenceState {
	stepNo: number;
	width: number;
	height: number;
}

export interface UserSequentialMessageState {
	[sequenceId: number]: SequenceState;
}
