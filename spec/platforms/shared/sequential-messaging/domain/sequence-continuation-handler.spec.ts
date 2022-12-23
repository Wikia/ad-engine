import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { SequenceContinuationHandler } from '@wikia/platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';
import {
	SequenceState,
	UserSequentialMessageState,
} from '@wikia/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
const initialStep = 2;
const expectedStep = 3;
let initialSequenceStateMock: SequenceState;
let userInitialStateAfterSecondStep: UserSequentialMessageState;
let userStateStoreSpy;
let targetingManagerSpy;
const expectedSequenceStateAfterStateUpdate = new SequenceState(
	expectedStep,
	sampleWidth,
	sampleHeight,
);

describe('Sequence Continuation Handler', () => {
	beforeEach(() => {
		initialSequenceStateMock = new SequenceState(initialStep, sampleWidth, sampleHeight);
		userInitialStateAfterSecondStep = { 5928558921: initialSequenceStateMock };
		userStateStoreSpy = makeUserStateStoreSpy();
		targetingManagerSpy = makeTargetingManagerSpy();
	});

	it('Handle an ongoing Sequence', () => {
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(3);
		};
		userStateStoreSpy.get.returns(userInitialStateAfterSecondStep);

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
			false,
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
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(99);
		};
		userStateStoreSpy.get.returns(userInitialStateAfterSecondStep);

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
			false,
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

	it('Handle no state', () => {
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(3);
		};
		userStateStoreSpy.get.returns(null);

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
			false,
		);
		sh.handleOngoingSequence();

		assert.calledOnce(userStateStoreSpy.get);
		assert.notCalled(targetingManagerSpy.setTargeting);
		assert.notCalled(userStateStoreSpy.set);
	});

	it('Handle UAP on FV', () => {
		const onIntermediateStepLoadMock = (stateStore: (loadedStep: number) => void) => {
			stateStore(3);
		};

		const initialUapSequenceStateMock = new SequenceState(initialStep, 2, 2, true);
		const userInitialStateAfterSecondStepUapSm = { 5928558921: initialUapSequenceStateMock };

		userStateStoreSpy.get.returns(userInitialStateAfterSecondStepUapSm);

		const sh = new SequenceContinuationHandler(
			userStateStoreSpy,
			targetingManagerSpy,
			onIntermediateStepLoadMock,
			true,
		);
		sh.handleOngoingSequence();

		assert.calledOnce(userStateStoreSpy.get);
		assert.notCalled(targetingManagerSpy.setTargeting);
		assert.notCalled(userStateStoreSpy.set);
	});
});
