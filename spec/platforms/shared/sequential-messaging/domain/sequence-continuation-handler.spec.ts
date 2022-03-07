import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { SequenceContinuationHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';
import { UserSequentialMessageState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
const userInitialStateAfterSecondStep: UserSequentialMessageState = {
	5928558921: { stepNo: 2, width: sampleWidth, height: sampleHeight },
};

describe('Sequence Continuation Handler', () => {
	it('Handle an ongoing Sequence', () => {
		const userStateStoreSpy = makeUserStateStoreSpy();
		const targetingManagerSpy = makeTargetingManagerSpy();
		userStateStoreSpy.get.returns(userInitialStateAfterSecondStep);
		const expectedStepNoAfterStateUpdate = 3;

		const sh = new SequenceContinuationHandler(userStateStoreSpy, targetingManagerSpy);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManagerSpy.setTargeting);
		assert.calledWith(
			targetingManagerSpy.setTargeting,
			sequenceId,
			sampleWidth,
			sampleHeight,
			expectedStepNoAfterStateUpdate,
		);
		assert.calledOnce(userStateStoreSpy.set);
		assert.calledWith(userStateStoreSpy.set, userInitialStateAfterSecondStep);
	});
});
