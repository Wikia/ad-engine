import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { makeSequentialMessagingConfigStoreSpy } from '../test_doubles/sequential-messaging-config-store.spy';
import { SequenceContinuationHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import sinon, { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';
import { Sequence } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequence';
import { SequenceEndStateHandler } from '../../../../../platforms/shared/sequential-messaging/domain/services/sequence-end-state-handler';

const configStoreSample = {
	5854346762: {
		length: '4',
		lastStepId: '123456789',
		targeting: { cid: 'sequential_messaging' },
	},
};

const sequenceBeforeLastStep: Sequence = { id: '5854346762', stepId: '123' };
const sequenceLastStep: Sequence = { id: '5854346762', stepId: '123456789' };

describe('Sequence Continuation Handler', () => {
	it('Handle a proper Sequence before last step', () => {
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		const userStateStore = makeUserStateStoreSpy();
		const targetingManager = makeTargetingManagerSpy();
		configStoreSpy.get.returns(configStoreSample);
		userStateStore.get.returns({ 5854346762: {} });
		const onSlotShowedEventSpy = sinon.spy((onEvent: SequenceEndStateHandler) => {
			onEvent.handleState(sequenceBeforeLastStep);
		});

		const sh = new SequenceContinuationHandler(
			configStoreSpy,
			userStateStore,
			targetingManager,
			onSlotShowedEventSpy,
		);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManager.setTargeting);
		assert.notCalled(userStateStore.delete);
		expect(onSlotShowedEventSpy.calledOnce).to.be.true;
	});

	it('Handle a proper Sequence on last step', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		configStoreSpy.get.returns(configStoreSample);
		userStateStore.get.returns({ 5854346762: {} });
		const onSlotShowedEventSpy = sinon.spy((onEvent: SequenceEndStateHandler) => {
			onEvent.handleState(sequenceLastStep);
		});

		const sh = new SequenceContinuationHandler(
			configStoreSpy,
			userStateStore,
			targetingManager,
			onSlotShowedEventSpy,
		);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManager.setTargeting);
		assert.calledOnce(userStateStore.delete);
		assert.notCalled(userStateStore.set);
	});

	it('Handle no configuration set', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns({ 5854346762: {} });
		configStoreSpy.get.returns(null);
		const onSlotShowedEventSpy = sinon.spy((onEvent: SequenceEndStateHandler) => {
			onEvent.handleState(sequenceBeforeLastStep);
		});

		const sh = new SequenceContinuationHandler(
			configStoreSpy,
			userStateStore,
			targetingManager,
			onSlotShowedEventSpy,
		);
		const res = sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		expect(res).to.be.false;
		assert.notCalled(targetingManager.setTargeting);
		assert.notCalled(userStateStore.delete);
		assert.notCalled(userStateStore.set);
	});

	it('Handle no Sequence', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns(undefined);
		configStoreSpy.get.returns(configStoreSample);
		const onSlotShowedEventSpy = sinon.spy((onEvent: SequenceEndStateHandler) => {
			onEvent.handleState(sequenceBeforeLastStep);
		});

		const sh = new SequenceContinuationHandler(
			configStoreSpy,
			userStateStore,
			targetingManager,
			onSlotShowedEventSpy,
		);
		const res = sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		expect(res).to.be.false;
		assert.notCalled(targetingManager.setTargeting);
		assert.notCalled(userStateStore.delete);
		assert.notCalled(userStateStore.set);
	});
});
