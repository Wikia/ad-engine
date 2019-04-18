import { expect } from 'chai';
import { incontentNative } from '../../pages/incontent-native.page';
import { timeouts } from '../../common/timeouts';
import { adSlots } from '../../common/ad-slots';
import { helpers } from '../../common/helpers';

describe('Incontent native page: incontent native', () => {
	before(() => {
		browser.url(incontentNative.pageLink);
		$(adSlots.incontentNative).waitForDisplayed(timeouts.standard);
	});

	it('Check if slot is visible in viewport', () => {
		const adStatus = adSlots.getSlotStatus(adSlots.incontentNative);

		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the proper campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentNative);
		expect(helpers.getLineItemId(adSlots.incontentNative)).to.equal(
			incontentNative.lineItemId,
			'Line item ID mismatch',
		);
	});
});
