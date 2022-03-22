import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { SequenceContinuationHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';
import { UserSequentialMessageState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
const initialSequenceState = { stepNo: 2, width: sampleWidth, height: sampleHeight };
const userInitialStateAfterSecondStep: UserSequentialMessageState = {
	5928558921: initialSequenceState,
};

describe('Sequence Continuation Handler', () => {
	it('Handle an ongoing Sequence', () => {
		const userStateStoreSpy = makeUserStateStoreSpy();
		const targetingManagerSpy = makeTargetingManagerSpy();
		const onIntermediateStepLoadMock = (stateStore: () => void) => {
			stateStore();
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
});
