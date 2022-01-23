import {
	SequentialMessage,
	SequentialMessageConfig,
	SequentialMessageState,
	SequentialMessageStateStore,
	SlotSequenceSupplier,
	TimestampSupplier,
} from './model';

export class SequenceHandler {
	private static isCappedInTime(
		state: SequentialMessageState,
		config: SequentialMessageConfig,
		timestamp: number,
	): boolean {
		if (config.capFromStart && timestamp - state.startedTimestamp > config.capFromStart) {
			return true;
		}
		return config.capFromLastView && timestamp - state.sequenceTimestamp > config.capFromLastView;
	}

	constructor(
		private sequenceSupplier: SlotSequenceSupplier,
		private stateStore: SequentialMessageStateStore,
		private timestampSupplier: TimestampSupplier,
	) {}

	getSequenceForSlot(slotSequenceDef: any): SequentialMessage {
		if (!slotSequenceDef) return undefined;

		const config: SequentialMessageConfig = this.sequenceSupplier.get(slotSequenceDef);
		if (!config) return undefined;

		const timestamp = this.timestampSupplier.get();
		let state: SequentialMessageState = this.stateStore.get();

		if (!state) {
			state = {
				sequenceMessageId: config.sequenceMessageId,
				sequenceNo: 0,
				startedTimestamp: timestamp,
				sequenceTimestamp: timestamp,
			};
		}
		if (state.sequenceNo >= config.length) {
			return undefined;
		}
		if (SequenceHandler.isCappedInTime(state, config, timestamp)) {
			return undefined;
		}
		state.sequenceNo = state.sequenceNo + 1;
		state.sequenceTimestamp = timestamp;
		this.stateStore.save(state);
		return state;
	}
}
