import {
	SequentialMessageConfig,
	SequentialMessageState,
	SequentialMessageStateStore,
	SlotSequenceSupplier,
	TimestampSupplier,
} from '@wikia/sequential-messaging/model';
import { SequenceHandler } from '@wikia/sequential-messaging/sequence-handler';
import { assert, expect } from 'chai';
import { createSandbox, match } from 'sinon';

class SlotSequenceSupplierStub implements SlotSequenceSupplier {
	get(slot: any): SequentialMessageConfig {
		return undefined;
	}
}

class SequentialMessagingUserStateStoreStub implements SequentialMessageStateStore {
	get(): SequentialMessageState {
		return undefined;
	}
	save(state: SequentialMessageState): void {}
}

class CurrentTimeSupplierStub implements TimestampSupplier {
	get(): number {
		return Date.now();
	}
}

function createConfig(
	id: string,
	len: number,
	startCap: number = 0,
	lastViewCap: number = 0,
): SequentialMessageConfig {
	return {
		sequenceMessageId: id,
		length: len,
		capFromStart: startCap,
		capFromLastView: lastViewCap,
	};
}

function createState(
	id: string,
	no: number = 1,
	seqTs: number = Date.now(),
	startTs: number = Date.now(),
): SequentialMessageState {
	return {
		sequenceMessageId: id,
		sequenceNo: no,
		sequenceTimestamp: seqTs,
		startedTimestamp: startTs,
	};
}

describe('Sequence Handler', () => {
	const sandbox = createSandbox();
	const supplierStub = sandbox.createStubInstance(SlotSequenceSupplierStub);
	const stateStoreStub = sandbox.createStubInstance(SequentialMessagingUserStateStoreStub);
	const currentTimeStub = sandbox.createStubInstance(CurrentTimeSupplierStub);
	const handler = new SequenceHandler(supplierStub, stateStoreStub, currentTimeStub);
	const slot = {};

	beforeEach(() => {
		sandbox.reset();
	});

	it('Should not get non available sequence', () => {
		// expect
		expect(handler.getSequenceForSlot(undefined)).to.equal(undefined);

		// given
		supplierStub.get.returns(undefined);

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		expect(sequence).to.equal(undefined);
	});

	it('Should get first message from sequence', () => {
		// given
		supplierStub.get.returns(createConfig('id', 777));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		expect(sequence).to.contains({
			sequenceMessageId: 'id',
			sequenceNo: 1,
		});
	});

	it('Should get next message from sequence', () => {
		// given
		const seqNo = 6;
		supplierStub.get.returns(createConfig('id', 777));
		stateStoreStub.get.returns(createState('id', seqNo));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		expect(sequence.sequenceNo).to.equal(seqNo + 1);
	});

	it('Should save sequence state for user', () => {
		// given
		const now = Date.now();
		const seqNo = 3;
		currentTimeStub.get.callThrough();
		supplierStub.get.returns(createConfig('id', 777));
		stateStoreStub.get.returns(createState('id', seqNo, now));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		assert.ok(
			stateStoreStub.save.calledWith(
				match
					.has('sequenceMessageId', 'id')
					.and(match.has('sequenceNo', seqNo + 1))
					.and(
						match.has(
							'sequenceTimestamp',
							match((ts) => ts >= now),
						),
					),
			),
		);
		expect(sequence.sequenceNo).to.equal(seqNo + 1);
	});

	it('Should not get fully played sequence', () => {
		// given
		supplierStub.get.returns(createConfig('id', 5));
		stateStoreStub.get.returns(createState('id', 5));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		assert.ok(stateStoreStub.save.notCalled);
		expect(sequence).to.equal(undefined);
	});

	it('Should not get sequence capped from start time', () => {
		// given
		const cap = 10;
		const startTime = Date.now();
		currentTimeStub.get.returns(startTime + cap + 1);
		supplierStub.get.returns(createConfig('id', 5, cap));
		stateStoreStub.get.returns(createState('id', 2, startTime + cap - 1, startTime));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		expect(sequence).to.equal(undefined);
	});

	it('Should not get sequence capped from last view time', () => {
		// given
		const cap = 10;
		const lastTime = Date.now();
		currentTimeStub.get.returns(lastTime + cap + 1);
		supplierStub.get.returns(createConfig('id', 5, 0, cap));
		stateStoreStub.get.returns(createState('id', 2, lastTime, lastTime - cap));

		// when
		const sequence = handler.getSequenceForSlot(slot);

		// then
		expect(sequence).to.equal(undefined);
	});
});
