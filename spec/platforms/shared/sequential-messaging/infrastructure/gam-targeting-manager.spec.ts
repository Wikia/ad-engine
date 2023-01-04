import sinon from 'sinon';
import { GamTargetingManager } from '../../../../../src/platforms/shared/sequential-messaging/infrastructure/gam-targeting-manager';
import { makeContextSpy } from '../../test_doubles/context.spy';
import { makeSlotsContextSpy } from '../test_doubles/slotContext.spy';
import { SequenceState } from '../../../../../src/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';
import { makeSlotsTargetingServiceSpy } from '../test_doubles/slotTargetingService.spy';

const baseTargetingSize = 10;
let contextSpy;
let slotsContextSpy;
let uapHandlerSpy;
let slotTargetingServiceSpy;

describe('Gam Targeting manager', () => {
	beforeEach(() => {
		contextSpy = makeContextSpy();
		slotsContextSpy = makeSlotsContextSpy();
		slotTargetingServiceSpy = makeSlotsTargetingServiceSpy();
		uapHandlerSpy = sinon.spy();
	});

	it('Set Targeting for TLB', () => {
		const sequenceId = '5928558921';
		const sequenceState: SequenceState = new SequenceState(2, 970, 250);

		const tm = new GamTargetingManager(
			contextSpy,
			slotsContextSpy,
			slotTargetingServiceSpy,
			baseTargetingSize,
			uapHandlerSpy,
		);
		tm.setTargeting(sequenceId, sequenceState);

		sinon.assert.notCalled(uapHandlerSpy);
		assertContextCalls(sequenceId, sequenceState);
	});

	it('Set Targeting for UAP', () => {
		const sequenceId = '5952729091';
		const sequenceState: SequenceState = new SequenceState(2, 2, 2, true);

		const tm = new GamTargetingManager(
			contextSpy,
			slotsContextSpy,
			slotTargetingServiceSpy,
			baseTargetingSize,
			uapHandlerSpy,
		);
		tm.setTargeting(sequenceId, sequenceState);

		sinon.assert.calledOnce(uapHandlerSpy);
		assertContextCalls(sequenceId, sequenceState);
	});

	function assertContextCalls(sequenceId: string, sequenceState: SequenceState) {
		sinon.assert.calledWith(slotsContextSpy.setSlotSize, 'top_leaderboard', [12, 12]);
		sinon.assert.calledWith(
			slotTargetingServiceSpy.set,
			'top_leaderboard',
			'sequential',
			sequenceId,
		);
		sinon.assert.calledWith(contextSpy.set, 'templates.sizeOverwritingMap', {
			'12x12': { originalSize: [sequenceState.width, sequenceState.height] },
			'13x13': { originalSize: [sequenceState.width, sequenceState.height] },
			'14x14': { originalSize: [sequenceState.width, sequenceState.height] },
		});
	}
});
