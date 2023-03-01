import { AdSlot } from '@wikia/core';
import { slotRefresher } from '@wikia/core/services/slot-refresher';
import sinon, { assert } from 'sinon';

describe('slot-refresher', () => {
	const basicConfig = { slots: ['test_slot'] };
	const fakeGPTSlot = {
		getSlotElementId: () => 'test_slot',
		clearTargeting: sinon.spy(),
		defineSizeMapping: sinon.spy(),
	};
	const fakeAdSlot = {
		isEnabled: () => true,
		getSlotName: () => 'test_slot',
		getCreativeSizeAsArray: () => [0, 0],
	};

	let clock;
	let originalGoogletag;

	let loggerSpy;
	let refreshSpy;
	let addEventListenerSpy;

	before(function () {
		clock = sinon.useFakeTimers({
			toFake: ['setTimeout'],
		});
		originalGoogletag = window.googletag;
		window.googletag = {
			sizeMapping: () => ({
				addSize: () => ({
					build: sinon.spy(),
				}),
			}),
			pubads: () => ({
				getSlots: () => [fakeGPTSlot],
				refresh: refreshSpy,
				addEventListener: addEventListenerSpy,
			}),
		} as any;
	});

	beforeEach(() => {
		loggerSpy = global.sandbox.spy();
		refreshSpy = global.sandbox.spy();
		addEventListenerSpy = global.sandbox.spy();
		slotRefresher.slotsInTheViewport = ['test_slot'];
	});

	after(function () {
		window.googletag = originalGoogletag;
		clock.restore();
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
		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlot(fakeAdSlot as AdSlot);
		clock.runAll();

		assert.calledOnce(refreshSpy);
	});

	it('should not refresh if slot is not enabled', () => {
		const fakeSlot = {
			...fakeAdSlot,
			isEnabled: () => false,
		} as AdSlot;

		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlot(fakeSlot);
		clock.runAll();

		assert.notCalled(refreshSpy);
	});

	it('should not refresh if slot is not registered in GPT', () => {
		const fakeSlot = {
			...fakeAdSlot,
			getSlotName: () => 'not_registered_slot',
		} as AdSlot;

		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlot(fakeSlot);
		clock.runAll();

		assert.notCalled(refreshSpy);
	});

	it('should not refresh slot outside of the viewport', () => {
		slotRefresher.slotsInTheViewport = [];
		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlot(fakeAdSlot as AdSlot);
		clock.runAll();

		assert.notCalled(refreshSpy);
	});

	it('should start listening to GPT event on attempt of refresh slot outside the viewport', () => {
		slotRefresher.slotsInTheViewport = [];
		slotRefresher.setupSlotRefresher(basicConfig, false, loggerSpy);
		slotRefresher.refreshSlot(fakeAdSlot as AdSlot);
		clock.runAll();

		assert.calledOnce(addEventListenerSpy);
	});
});
