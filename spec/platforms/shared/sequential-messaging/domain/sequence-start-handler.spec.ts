import {
	SequenceState,
	UserSequentialMessageState,
} from '@wikia/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';
import { SequenceStartHandler } from '@wikia/platforms/shared/sequential-messaging/domain/sequence-start-handler';
import { assert } from 'sinon';
import { makeUserStateStoreSpy } from '../test_doubles/state-store.spy';

const sequenceId = '5928558921';
const sampleWidth = 970;
const sampleHeight = 250;
const uap = true;
const userState: UserSequentialMessageState = {
	5928558921: new SequenceState(1, sampleWidth, sampleHeight, uap),
};

describe('Sequence Start Handler', () => {
	it('Handle a proper Sequence', () => {
		const userStateStore = makeUserStateStoreSpy();

		const sh = new SequenceStartHandler(userStateStore);

		sh.startSequence(sequenceId, sampleWidth, sampleHeight, uap);

		assert.calledOnce(userStateStore.set);
		assert.calledWith(userStateStore.set, userState);
	});
});
