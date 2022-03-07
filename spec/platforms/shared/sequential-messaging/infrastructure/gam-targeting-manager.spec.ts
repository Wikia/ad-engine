import sinon from 'sinon';
import { GamTargetingManager } from '../../../../../platforms/shared/sequential-messaging/infrastructure/gam-targeting-manager';
import { makeContextSpy } from '../test_doubles/context.spy';
import { makeSlotsContextSpy } from '../test_doubles/slotContext.spy';

describe('Gam Targeting manager', () => {
	it('Set Targeting', () => {
		const contextSpy = makeContextSpy();
		const slotsContextSpy = makeSlotsContextSpy();
		const sequenceId = '5928558921';
		const width = 970;
		const height = 250;
		const stepNo = 2;

		const tm = new GamTargetingManager(contextSpy, slotsContextSpy);
		tm.setTargeting(sequenceId, width, height, stepNo);

		sinon.assert.calledWith(contextSpy.set, 'targeting.uap', sequenceId);
		sinon.assert.calledWith(slotsContextSpy.setSlotSize, 'top_leaderboard', [12, 12]);
	});
});
