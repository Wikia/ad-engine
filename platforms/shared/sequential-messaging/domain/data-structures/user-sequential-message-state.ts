export interface UserSequentialMessageState {
	[sequentialAdId: number]: { length: number; targeting: Record<string, unknown> };
}
