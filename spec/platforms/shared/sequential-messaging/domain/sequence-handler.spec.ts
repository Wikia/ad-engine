import { expect } from 'chai';
import { assert } from 'sinon';
import { SequenceHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-handler';
import { makeSequentialMessagingConfigStoreSpy } from '../test_doubles/sequential-messaging-config-store.spy';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';

describe('Sequence Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();
		const sequentialMessagingConfigStoreSpy = makeSequentialMessagingConfigStoreSpy();
		sequentialMessagingConfigStoreSpy.get.returns({
			1234567890: {
				length: '4',
			},
		});

		const sh = new SequenceHandler(sequentialMessagingConfigStoreSpy, userStateStore);
		sh.handleItem('1234567890');
		sh.handleItem('111');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, {
			1234567890: {
				length: '4',
			},
		});
	});

	it('Handle no line items configured', () => {
		const userStateStore = makeUserStateStoreSpy();
		const sequentialMessagingConfigStoreSpy = makeSequentialMessagingConfigStoreSpy();
		sequentialMessagingConfigStoreSpy.get.returns(undefined);

		const sh = new SequenceHandler(sequentialMessagingConfigStoreSpy, userStateStore);

		sh.handleItem('1234567890');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.notCalled(userStateStore.set);
	});
});
