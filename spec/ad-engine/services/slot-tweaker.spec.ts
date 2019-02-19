import { expect } from 'chai';
import adSlotFake from '../ad-slot-fake';
import { slotTweaker } from '../../../src/ad-engine/services/slot-tweaker';

describe('slot-tweaker', () => {
	it('setDataParam accepts a string', () => {
		const mockedValue = 'qunitParamValue';

		slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

		expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal(mockedValue);
	});

	it('setDataParam accepts an object', () => {
		const mockedValue = {
			param1: 'value1',
			param2: 'value2',
		};

		slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

		expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal(
			'{"param1":"value1","param2":"value2"}',
		);
	});

	it('setDataParam accepts an array', () => {
		const mockedValue = ['value1', 'value2'];

		slotTweaker.setDataParam(adSlotFake, 'qunitParam', mockedValue);

		expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal('["value1","value2"]');
	});

	it('setDataParam accepts a boolean', () => {
		slotTweaker.setDataParam(adSlotFake, 'qunitParam', true);

		expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal('true');
	});

	it('setDataParam accepts a boolean', () => {
		slotTweaker.setDataParam(adSlotFake, 'qunitParam', false);

		expect(slotTweaker.getContainer(adSlotFake).dataset.qunitParam).to.equal('false');
	});
});
