import { SlotConfig } from '@wikia/ad-engine';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { context } from '../../../src/ad-engine/services/context-service';
import { slotService } from '../../../src/ad-engine/services/slot-service';
import adSlotFake from '../ad-slot-fake';

let adSlot;
let elementProperties = {};
let slotConfigs: { [key: string]: Partial<SlotConfig> };

function clearSlotServiceState() {
	this.slots = {};
	this.slotStates = {};
	this.slotStatuses = {};
}

describe('slot-service', () => {
	beforeEach(() => {
		const originalGet = context.get;

		sinon.stub(context, 'get').callsFake((key) => {
			if (key === 'slots') {
				return slotConfigs;
			}

			return originalGet(key);
		});
	});

	afterEach(() => {
		document.getElementById.restore();
		context.get.restore();
	});

	beforeEach(() => {
		elementProperties = {
			offsetParent: {
				offsetTop: 0,
				offsetParent: null,
			},
		};
		slotConfigs = {};

		sinon
			.stub(document, 'getElementById')
			.withArgs('foo-container')
			.returns({
				classList: {
					contains: () => {},
				},
				offsetHeight: 300,
				offsetTop: 100,
				offsetParent: elementProperties.offsetParent,
				ownerDocument: {},
			});

		adSlot = { ...adSlotFake };
		adSlot.getViewportConflicts = () => ['foo-container'];
		adSlot.hasDefinedViewportConflicts = () => true;
	});

	it('getter', () => {
		slotService.add(adSlot);

		expect(slotService.get('FAKE_AD')).to.equal(adSlot);
	});

	it('getter for slot with multiple positions', () => {
		slotService.add(adSlot);

		expect(slotService.get('FAKE_AD,FOO')).to.equal(adSlot);
	});

	it('getter for slot with different single targeting.pos', () => {
		adSlot.config.targeting.pos = 'bar3';
		slotService.add(adSlot);

		expect(slotService.get('bar3')).to.equal(adSlot);
	});

	it('getter for slot with different multiple targeting.pos', () => {
		adSlot.config.targeting.pos = ['foo1', 'bar2'];
		slotService.add(adSlot);

		expect(slotService.get('foo1')).to.equal(adSlot);
	});

	it('foreach iterator', () => {
		slotService.add(adSlot);

		slotService.forEach((slot) => {
			expect(slot).to.equal(slot);
		});
	});

	it('checks whether slot has viewport conflicts', () => {
		adSlot.setOffsetTop(500);

		expect(slotService.hasViewportConflict(adSlot)).to.equals(true);
	});

	it('checks whether slot does not have viewport conflicts (when there is enough space)', () => {
		adSlot.setOffsetTop(2000);

		expect(slotService.hasViewportConflict(adSlot)).to.equals(false);
	});

	it('does not calculate conflicts when slot does not have defined any', () => {
		adSlot.hasDefinedViewportConflicts = () => false;

		expect(slotService.hasViewportConflict(adSlot)).to.equals(false);
	});

	it('does not calculate conflicts when slot does not have DOM element', () => {
		adSlot.getElement = () => null;

		expect(slotService.hasViewportConflict(adSlot)).to.equals(false);
	});

	it('checks whether slot does not have viewport conflicts with hidden element', () => {
		elementProperties.offsetParent = null;

		adSlot.setOffsetTop(2000);

		expect(slotService.hasViewportConflict(adSlot)).to.equals(false);
	});

	it('slot state is truthy when it was not defined before', () => {
		expect(slotService.getState('foo')).to.equals(true);
	});

	it('slot state is truthy when it was enabled before', () => {
		slotService.enable('foo');

		expect(slotService.getState('foo')).to.equals(true);
	});

	it('slot state is falsy when it was disabled before', () => {
		slotService.disable('foo');

		expect(slotService.getState('foo')).to.equals(false);
	});

	describe('getAtfSlotNames', () => {
		beforeEach(() => {
			clearSlotServiceState.bind(slotService)();
		});

		it('should return only first all slots', () => {
			slotConfigs = {
				A: { aboveTheFold: true, disabled: true },
				B: { aboveTheFold: true, disabled: false },
				C: { aboveTheFold: false, disabled: true },
				D: { aboveTheFold: false, disabled: false },
			};

			const result = slotService.getAtfSlotNames();

			expect(result.length).to.equals(2);
			expect(result.includes('A')).to.equals(true);
			expect(result.includes('B')).to.equals(true);
		});
	});

	describe('getFirstCallSlotNames', () => {
		beforeEach(() => {
			clearSlotServiceState.bind(slotService)();
		});

		it('should return only first all slots', () => {
			slotConfigs = {
				A: { firstCall: true, disabled: true },
				B: { firstCall: true, disabled: false },
				C: { firstCall: false, disabled: true },
				D: { firstCall: false, disabled: false },
			};

			const result = slotService.getFirstCallSlotNames();

			expect(result.length).to.equals(2);
			expect(result.includes('A')).to.equals(true);
			expect(result.includes('B')).to.equals(true);
		});
	});

	describe('getEnabledSlotNames', () => {
		beforeEach(() => {
			clearSlotServiceState.bind(slotService)();
		});

		it('should return only enabled slots', () => {
			slotConfigs = {
				A: { firstCall: true, disabled: true },
				B: { firstCall: true, disabled: false },
				C: { firstCall: false, disabled: true },
				D: { firstCall: false, disabled: false },
			};

			const result = slotService.getEnabledSlotNames();

			expect(result.length).to.equals(2);
			expect(result.includes('B')).to.equals(true);
			expect(result.includes('D')).to.equals(true);
		});
	});
});
