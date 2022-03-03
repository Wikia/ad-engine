import { assert } from 'sinon';
import { SequenceStartHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-start-handler';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { UserSequentialMessageState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const userState: UserSequentialMessageState = { 5928558921: { stepNo: 1 } };

describe('Sequence Start Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();

		const sh = new SequenceStartHandler(userStateStore);

		sh.startSequence(sequenceId);

		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, userState);
	});
});
