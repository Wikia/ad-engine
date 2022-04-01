export class SequenceState {
	readonly UAP_MOBILE_WIDTH: number = 2;
	readonly UAP_DESKTOP_WIDTH: number = 3;

	constructor(public stepNo: number, public width: number, public height: number) {}

	isUap(): boolean {
		return this.width === this.UAP_MOBILE_WIDTH || this.width === this.UAP_DESKTOP_WIDTH;
	}
}

export interface UserSequentialMessageState {
	[sequenceId: number]: SequenceState;
}
