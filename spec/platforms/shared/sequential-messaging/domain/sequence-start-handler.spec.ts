import { expect } from 'chai';
import { assert } from 'sinon';
import { SequenceStartHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-start-handler';
import { makeSequentialMessagingConfigStoreSpy } from '../test_doubles/sequential-messaging-config-store.spy';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';

describe('Sequence Start Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		configStoreSpy.get.returns({
			1234567890: {
				length: '4',
			},
		});

		const sh = new SequenceStartHandler(configStoreSpy, userStateStore);
		sh.handleItem('1234567890');
		sh.handleItem('111');

		expect(sh).to.be.instanceOf(SequenceStartHandler);
		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, {
			1234567890: {
				length: '4',
			},
		});
	});

	it('Handle no line items configured', () => {
		const userStateStore = makeUserStateStoreSpy();
		const configStoreSpy = makeSequentialMessagingConfigStoreSpy();
		configStoreSpy.get.returns(undefined);

		const sh = new SequenceStartHandler(configStoreSpy, userStateStore);

		sh.handleItem('1234567890');

		expect(sh).to.be.instanceOf(SequenceStartHandler);
		assert.notCalled(userStateStore.set);
	});
});
