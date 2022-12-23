import { assert } from 'sinon';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { SequenceEndHandler } from '@wikia/platforms/shared/sequential-messaging/domain/sequence-end-handler';

describe('Sequence End Handler', () => {
	it('Handle sequence end', () => {
		const userStateStore = makeUserStateStoreSpy();

		const sh = new SequenceEndHandler(userStateStore);
		sh.endSequence();

		assert.calledOnce(userStateStore.delete);
	});
});
