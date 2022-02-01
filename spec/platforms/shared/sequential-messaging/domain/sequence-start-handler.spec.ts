import { expect } from 'chai';
import { assert } from 'sinon';
import { SequenceStartHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-start-handler';
import { makeSequentialMessagingConfigStoreSpy } from '../test_doubles/sequential-messaging-config-store.spy';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { Sequence } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequence';

const sequence: Sequence = { id: '5854346762', stepId: '123456789' };
const notSequence: Sequence = { id: '0', stepId: '123456789' };

describe('Sequence Start Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		configStoreSpy.get.returns({
			5854346762: {
				length: '4',
				lastStepId: '123456789',
				targeting: { cid: 'sequential_messaging' },
			},
		});

		const sh = new SequenceStartHandler(configStoreSpy, userStateStore);

		sh.handleSequence(sequence);
		sh.handleSequence(notSequence);

		expect(sh).to.be.instanceOf(SequenceStartHandler);
		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, {
			5854346762: {
				lastStepId: '123456789',
			},
		});
	});

	it('Handle no line items configured', () => {
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		configStoreSpy.get.returns(null);

		const sh = new SequenceStartHandler(configStoreSpy, userStateStore);

		sh.handleSequence(sequence);

		expect(sh).to.be.instanceOf(SequenceStartHandler);
		assert.notCalled(userStateStore.set);
	});
});
