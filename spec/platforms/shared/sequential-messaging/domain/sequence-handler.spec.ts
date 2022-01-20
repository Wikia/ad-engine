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
		assert.calledWith(userStateStore.set, 'sequential_messaging', {
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

	it('Handle invalid config', () => {
		const userStateStore = makeUserStateStoreSpy();
		const smConfigStore_invalidValueType = makeSequentialMessagingConfigStoreSpy();
		smConfigStore_invalidValueType.get.returns([]);
		const smConfigStore_emptyObject = makeSequentialMessagingConfigStoreSpy();
		smConfigStore_emptyObject.get.returns({});
		const smConfigStore_invalidLineItemValue = makeSequentialMessagingConfigStoreSpy();
		smConfigStore_invalidLineItemValue.get.returns({
			1234567890: 'invalid value',
		});
		const smConfigStore_invalidLengthValue = makeSequentialMessagingConfigStoreSpy();
		smConfigStore_invalidLengthValue.get.returns({
			1234567890: {
				length: [4],
			},
		});

		const sh1 = new SequenceHandler(smConfigStore_invalidValueType, userStateStore);
		const sh2 = new SequenceHandler(smConfigStore_emptyObject, userStateStore);
		const sh3 = new SequenceHandler(smConfigStore_invalidLineItemValue, userStateStore);
		const sh4 = new SequenceHandler(smConfigStore_invalidLengthValue, userStateStore);

		sh1.handleItem('1234567890');
		sh2.handleItem('1234567890');
		sh3.handleItem('1234567890');
		sh4.handleItem('1234567890');

		assert.notCalled(userStateStore.set);
	});
});
