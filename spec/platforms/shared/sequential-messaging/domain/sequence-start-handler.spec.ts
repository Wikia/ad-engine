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
			5854346762: {
				length: '4',
				targeting: { cid: 'sequential_messaging' },
			},
		});

		const sh = new SequenceStartHandler(configStoreSpy, userStateStore);
		sh.handleItem('5854346762');
		sh.handleItem('111');

		expect(sh).to.be.instanceOf(SequenceStartHandler);
		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, {
			5854346762: {
				length: '4',
				targeting: { cid: 'sequential_messaging' },
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
