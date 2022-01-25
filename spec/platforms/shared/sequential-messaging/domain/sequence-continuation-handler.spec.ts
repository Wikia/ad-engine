import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { makeSequentialMessagingConfigStoreSpy } from '../test_doubles/sequential-messaging-config-store.spy';
import { SequenceContinuationHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-continuation-handler';
import { expect } from 'chai';
import { assert } from 'sinon';
import { makeTargetingManagerSpy } from '../test_doubles/targeting-manager.spy';

const configStoreSample = {
	5854346762: {
		length: '4',
		targeting: { cid: 'sequential_messaging' },
	},
};

describe('Sequence Continuation Handler', () => {
	it('Handle a proper Sequence before last step', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns({ 5854346762: { step: 1 } });
		configStoreSpy.get.returns(configStoreSample);

		const sh = new SequenceContinuationHandler(configStoreSpy, userStateStore, targetingManager);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManager.setTargeting);
		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, {
			5854346762: {
				step: 2,
			},
		});
	});

	it('Handle a proper Sequence on last step', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns({ 5854346762: { step: 3 } });
		configStoreSpy.get.returns(configStoreSample);

		const sh = new SequenceContinuationHandler(configStoreSpy, userStateStore, targetingManager);
		sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		assert.calledOnce(targetingManager.setTargeting);
		assert.calledOnce(userStateStore.delete);
		assert.notCalled(userStateStore.set);
	});

	it('Handle abnormal Sequence on overstep', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns({ 5854346762: { step: 5 } });
		configStoreSpy.get.returns(configStoreSample);

		const sh = new SequenceContinuationHandler(configStoreSpy, userStateStore, targetingManager);
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
		userStateStore.get.returns({ 5854346762: { step: 1 } });
		configStoreSpy.get.returns(null);

		const sh = new SequenceContinuationHandler(configStoreSpy, userStateStore, targetingManager);
		const res = sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		expect(res).to.be.false;
		assert.notCalled(targetingManager.setTargeting);
		assert.notCalled(userStateStore.set);
	});

	it('Handle no Sequence', () => {
		const targetingManager = makeTargetingManagerSpy();
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		userStateStore.get.returns(undefined);
		configStoreSpy.get.returns(configStoreSample);

		const sh = new SequenceContinuationHandler(configStoreSpy, userStateStore, targetingManager);
		const res = sh.handleOngoingSequence();

		expect(sh).to.be.instanceOf(SequenceContinuationHandler);
		expect(res).to.be.false;
		assert.notCalled(targetingManager.setTargeting);
		assert.notCalled(userStateStore.set);
	});
});
