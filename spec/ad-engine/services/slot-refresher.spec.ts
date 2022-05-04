import { slotRefresher } from '@wikia/ad-engine/services/slot-refresher';
import sinon, { assert } from 'sinon';
import { AdSlot } from '@wikia/ad-engine';

describe('slot-refresher', () => {
	const basicConfig = { slots: ['test_slot'] };
	const fakeGPTSlot = { getSlotElementId: () => 'test_slot' };

	const sandbox = sinon.createSandbox();
	let clock;
	let originalGoogletag;

	const loggerSpy = sandbox.spy();
	const refreshSpy = sandbox.spy();

	before(function () {
		clock = sinon.useFakeTimers({
			toFake: ['setTimeout'],
		});
		originalGoogletag = window.googletag;
		window.googletag = {
			pubads: () => ({
				getSlots: () => [fakeGPTSlot],
				refresh: refreshSpy,
			}),
		} as any;
	});

	after(function () {
		window.googletag = originalGoogletag;
	});

	afterEach(function () {
		sandbox.resetHistory();
	});

	it('should be enabled if there is no UAP', () => {
		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);

		assert.calledOnce(loggerSpy.withArgs('enabled'));
	});

	it('should be disabled if there is no slots in config', () => {
		slotRefresher.setupSlotRefresher({}, false, loggerSpy);

		assert.calledOnce(loggerSpy.withArgs('disabled'));
	});

	it('should be disabled if there is no UAP', () => {
		slotRefresher.setupSlotRefresher(basicConfig, true, loggerSpy);

		assert.calledOnce(loggerSpy.withArgs('disabled'));
	});

	it('should refresh', () => {
		const fakeSlot = {
			isEnabled: () => true,
			getSlotName: () => 'test_slot',
		} as AdSlot;

		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlotIfPossible(fakeSlot);
		clock.runAll();

		assert.calledOnce(refreshSpy);
	});

	it('should not refresh refresh if slot is not enabled', () => {
		const fakeSlot = {
			isEnabled: () => false,
			getSlotName: () => 'test_slot',
		} as AdSlot;

		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlotIfPossible(fakeSlot);
		clock.runAll();

		assert.notCalled(refreshSpy);
	});

	it('should not refresh refresh if slot is not registered in GPT', () => {
		const fakeSlot = {
			isEnabled: () => true,
			getSlotName: () => 'not_registered_slot',
		} as AdSlot;

		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlotIfPossible(fakeSlot);
		clock.runAll();

		assert.notCalled(refreshSpy);
	});
});
