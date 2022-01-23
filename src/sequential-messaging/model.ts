export interface SequentialMessageConfig {
	sequenceMessageId: string;
	length: number;
	capFromStart: number;
	capFromLastView: number;
}

export interface SequentialMessageState {
	sequenceMessageId: string;
	sequenceNo: number;
	startedTimestamp: number;
	sequenceTimestamp: number;
}

export type SequentialMessage = SequentialMessageState | undefined;

export interface TimestampSupplier {
	get(): number;
}

export interface SlotSequenceSupplier<SlotSequenceDef> {
	get(slotSequenceDef: SlotSequenceDef): SequentialMessageConfig;
}

export interface SequentialMessageStateStore {
	get(): SequentialMessageState;
	save(state: SequentialMessageState): void;
}
