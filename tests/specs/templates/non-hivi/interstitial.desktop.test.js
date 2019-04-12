import { expect } from 'chai';
import { interstitial } from '../../../pages/interstitial.page';
import { timeouts } from '../../../common/timeouts';
import { adSlots } from '../../../common/ad-slots';

// TODO Fix template
xdescribe('Interstitial page: interstitial', () => {
	before(() => {
		browser.url(interstitial.pageLink);
		$(interstitial.outOfPageWrapper).waitForDisplayed(timeouts.standard);
	});

	it('Check if interstitial is displayed with close button and advertisement label', () => {
		$(interstitial.closeButton).waitForDisplayed(timeouts.standard);
		$(interstitial.advertisementLabel).waitForDisplayed(timeouts.standard);

		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Interstitial not in the viewport',
		).to.be.true;
	});

	it('Check if interstitial disappears after clicking close button', () => {
		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Interstitial not in the viewport',
		).to.be.true;
		$(interstitial.stopScrolling).waitForExist(timeouts.standard);

		$(interstitial.closeButton).click();
		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Interstitial is in the viewport',
		).to.be.false;
		$(interstitial.stopScrolling).waitForExist(timeouts.standard, true);
	});
});
