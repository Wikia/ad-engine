// @ts-strict-ignore
import {
	context,
	Dictionary,
	SlotConfig,
	slotService,
	TargetingService,
	targetingService,
} from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';
import { adSlotFake } from '../ad-slot-fake';

let adSlot;
let elementProperties: any = {};
let slotConfigs: Dictionary<Partial<SlotConfig>>;

function clearSlotServiceState(): void {
	this.slots = {};
	this.slotStates = {};
	this.slotStatuses = {};
}

describe('slot-service', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		const originalGet = context.get;

		global.sandbox.stub(context, 'get').callsFake((key) => {
			if (key === 'slots') {
				return slotConfigs;
			}

			return originalGet(key);
		});

		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	beforeEach(() => {
		elementProperties = {
			offsetParent: {
				offsetTop: 0,
				offsetParent: null,
			},
		};
		slotConfigs = {};

		global.sandbox
			.stub(document, 'getElementById')
			.withArgs('foo-container')
			.returns({
				classList: {
					contains: () => {},
				},
				getBoundingClientRect: () => ({ top: 0, left: 0 } as any),
				offsetHeight: 300,
				offsetParent: elementProperties.offsetParent,
				ownerDocument: {},
			} as any);

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
		targetingServiceStub.get.withArgs('pos', 'FAKE_AD').returns('bar3');
		slotService.add(adSlot);

		expect(slotService.get('bar3')).to.equal(adSlot);
	});

	it('getter for slot with different multiple targeting.pos', () => {
		targetingServiceStub.get.withArgs('pos', 'FAKE_AD').returns(['foo1', 'bar2']);
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
