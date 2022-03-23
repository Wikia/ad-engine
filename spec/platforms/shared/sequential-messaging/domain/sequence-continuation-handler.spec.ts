import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { SequenceContinuationHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';
import {
	SequenceState,
	UserSequentialMessageState,
} from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
let initialSequenceState: SequenceState;
let userInitialStateAfterSecondStep: UserSequentialMessageState;

describe('Sequence Continuation Handler', () => {
	beforeEach(() => {
		initialSequenceState = { stepNo: 2, width: sampleWidth, height: sampleHeight };
		userInitialStateAfterSecondStep = { 5928558921: initialSequenceState };
	});

	it('Handle an ongoing Sequence', () => {
		const userStateStoreSpy = makeUserStateStoreSpy();
		const targetingManagerSpy = makeTargetingManagerSpy();
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(3);
		};
		userStateStoreSpy.get.returns(userInitialStateAfterSecondStep);
		const expectedSequenceStateAfterStateUpdate = {
			stepNo: 3,
			width: sampleWidth,
			height: sampleHeight,
		};

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
		);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManagerSpy.setTargeting);
		assert.calledWith(
			targetingManagerSpy.setTargeting,
			sequenceId,
			expectedSequenceStateAfterStateUpdate,
		);
		assert.calledOnce(userStateStoreSpy.set);
		assert.calledWith(userStateStoreSpy.set, userInitialStateAfterSecondStep);
	});

	it('Handle invalid step loaded', () => {
		const userStateStoreSpy = makeUserStateStoreSpy();
		const targetingManagerSpy = makeTargetingManagerSpy();
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(99);
		};
		userStateStoreSpy.get.returns(userInitialStateAfterSecondStep);
		const expectedSequenceStateAfterStateUpdate = {
			stepNo: 3,
			width: sampleWidth,
			height: sampleHeight,
		};

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
		);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManagerSpy.setTargeting);
		assert.calledWith(
			targetingManagerSpy.setTargeting,
			sequenceId,
			expectedSequenceStateAfterStateUpdate,
		);
		assert.notCalled(userStateStoreSpy.set);
	});
});
