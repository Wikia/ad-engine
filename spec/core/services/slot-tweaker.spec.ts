// @ts-strict-ignore
import { SlotTweaker } from '@wikia/core/services/slot-tweaker';
import { expect } from 'chai';
import { adSlotFake } from '../ad-slot-fake';

let slotTweaker: SlotTweaker;

describe('slot-tweaker', () => {
	beforeEach(() => {
		slotTweaker = new SlotTweaker();
	});

	describe('setDataParam', () => {
		it('should accept a string', () => {
			const mockedValue = 'qunitParamValue';

			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', mockedValue);

			expect(adSlotFake.getElement().dataset.qunitParam).to.equal(mockedValue);
		});

		it('should accept an object', () => {
			const mockedValue = {
				param1: 'value1',
				param2: 'value2',
			};

			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', mockedValue);

			expect(adSlotFake.getElement().dataset.qunitParam).to.equal(
				'{"param1":"value1","param2":"value2"}',
			);
		});

		it('should accept an array', () => {
			const mockedValue = ['value1', 'value2'];

			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', mockedValue);

			expect(adSlotFake.getElement().dataset.qunitParam).to.equal('["value1","value2"]');
		});

		it('should accept a boolean', () => {
			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', true);

			expect(adSlotFake.getElement().dataset.qunitParam).to.equal('true');
		});

		it('should accept a boolean', () => {
			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', false);

			expect(adSlotFake.getElement().dataset.qunitParam).to.equal('false');
		});

		it('should not break if slot has no container', () => {
			adSlotFake.getElement = () => null;

			slotTweaker.setDataParam(adSlotFake as any, 'qunitParam', true);
		});
	});
});
