export class SequenceState {
	constructor(
		public stepNo: number,
		public width: number,
		public height: number,
		public uap: boolean = false,
	) {}

	isUap(): boolean {
		return this.uap;
	}
}

export interface UserSequentialMessageState {
	[sequenceId: number]: SequenceState;
}
