export interface UserSequentialMessageState {
	[sequenceId: number]: { stepNo: number; width: number; height: number };
}
