import { expect } from 'chai';
import { adSlots } from '../../common/ad-slots';
import { injectedAds } from '../../pages/injected-ad.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe('Injected slots: injected boxad', () => {
	before(() => {
		helpers.navigateToUrl(injectedAds.pageLink);
		helpers.slowScroll(500);
		$(adSlots.injectedBoxad).waitForDisplayed(timeouts.standard);
		slots.injectedBoxad.scrollIntoView();
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.injectedBoxad,
			adSlots.incontentWidth,
			adSlots.incontentHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});
});
