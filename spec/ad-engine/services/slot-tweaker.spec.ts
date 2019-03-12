import { expect } from 'chai';
import { SlotTweaker } from '../../../src/ad-engine/services/slot-tweaker';
import adSlotFake from '../ad-slot-fake';

let slotTweaker: SlotTweaker;

describe('slot-tweaker', () => {
	beforeEach(() => {
		slotTweaker = new SlotTweaker();
	});

	describe('setDataParam', () => {
		it('should accept a string', () => {
			const mockedValue = 'qunitParamValue';

			slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

			expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal(mockedValue);
		});

		it('should accept an object', () => {
			const mockedValue = {
				param1: 'value1',
				param2: 'value2',
			};

			slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

			expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal(
				'{"param1":"value1","param2":"value2"}',
			);
		});

		it('should accept an array', () => {
			const mockedValue = ['value1', 'value2'];

			slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

			expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal(
				'["value1","value2"]',
			);
		});

		it('should accept a boolean', () => {
			slotTweaker.setDataParam(adSlotFake, 'qunitParam', true);

			expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal('true');
		});

		it('should accept a boolean', () => {
			slotTweaker.setDataParam(adSlotFake, 'qunitParam', false);

			expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal('false');
		});

		it('should not break if slot has no container', () => {
			slotTweaker.getContainer = () => null;

			slotTweaker.setDataParam(adSlotFake, 'qunitParam', true);
		});
	});
});
