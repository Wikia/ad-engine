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

export interface AdSlot {
	getSlotName(): string;
}

export interface SlotSequenceSupplier {
	get(slot: AdSlot): SequentialMessageConfig;
}

export interface SequentialMessagingStateStore {
	get(): SequentialMessageState;
	save(state: SequentialMessageState): void;
}
