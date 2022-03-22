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

		sinon.assert.calledWith(slotsContextSpy.setSlotSize, 'top_leaderboard', [12, 12]);
		sinon.assert.calledWith(
			contextSpy.set,
			'slots.top_leaderboard.targeting.sequential',
			sequenceId,
		);
		sinon.assert.calledWith(contextSpy.set, 'templates.sizeOverwritingMap', {
			'12x12': { originalSize: [sequenceState.width, sequenceState.height] },
			'13x13': { originalSize: [sequenceState.width, sequenceState.height] },
			'14x14': { originalSize: [sequenceState.width, sequenceState.height] },
		});
	});
});
