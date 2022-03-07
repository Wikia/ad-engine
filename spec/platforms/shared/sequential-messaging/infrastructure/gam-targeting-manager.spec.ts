import sinon from 'sinon';
import { GamTargetingManager } from '../../../../../platforms/shared/sequential-messaging/infrastructure/gam-targeting-manager';
import { makeContextSpy } from '../test_doubles/context.spy';
import { makeSlotsContextSpy } from '../test_doubles/slotContext.spy';
import { SequenceState } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';

describe('Gam Targeting manager', () => {
	it('Set Targeting', () => {
		const contextSpy = makeContextSpy();
		const slotsContextSpy = makeSlotsContextSpy();
		const sequenceId = '5928558921';
		const sequenceState: SequenceState = { stepNo: 2, width: 970, height: 250 };

		const tm = new GamTargetingManager(contextSpy, slotsContextSpy);
		tm.setTargeting(sequenceId, sequenceState);

		sinon.assert.calledWith(contextSpy.set, 'targeting.uap', sequenceId);
		sinon.assert.calledWith(slotsContextSpy.setSlotSize, 'top_leaderboard', [12, 12]);
	});
});
