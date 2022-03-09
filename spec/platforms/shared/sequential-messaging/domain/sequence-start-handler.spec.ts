import { assert } from 'sinon';
import { SequenceStartHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-start-handler';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';
import { UserSequentialMessageState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
const userState: UserSequentialMessageState = {
	5928558921: { stepNo: 1, width: sampleWidth, height: sampleHeight },
};

describe('Sequence Start Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();

		const sh = new SequenceStartHandler(userStateStore);

		sh.startSequence(sequenceId, sampleWidth, sampleHeight);

		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, userState);
	});
});
