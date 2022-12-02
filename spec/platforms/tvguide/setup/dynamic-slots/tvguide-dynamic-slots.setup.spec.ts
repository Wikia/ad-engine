import { TvguideDynamicSlotsSetup } from '@wikia/platforms/tvguide/setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { expect } from 'chai';

describe('TV Guide - getAdSlotNameFromPlaceholde() works properly', () => {
	it('adSlotName is extracted correctly from the placeholder', () => {
		const placeholder = document.createElement('div');
		placeholder.classList.add('class1', 'c-adDisplay_container_slot1', 'class2');

		const tvguideInstance = new TvguideDynamicSlotsSetup();

		const adSlotName = tvguideInstance.getAdSlotNameFromPlaceholder(placeholder);

		expect(adSlotName).to.equal('slot1');
	});

	it('When placeholder classList does not contain adSlotId, the function returns null', () => {
		const placeholder = document.createElement('div');
		placeholder.classList.add('class1', 'class2');

		const tvguideInstance = new TvguideDynamicSlotsSetup();

		const adSlotName = tvguideInstance.getAdSlotNameFromPlaceholder(placeholder);

		expect(adSlotName).to.be.null;
	});
});
