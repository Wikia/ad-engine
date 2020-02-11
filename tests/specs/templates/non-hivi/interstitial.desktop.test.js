import { expect } from 'chai';
import { interstitial } from '../../../pages/interstitial.page';
import { timeouts } from '../../../common/timeouts';
import { slots } from '../../../common/slot-registry';
import { helpers } from '../../../common/helpers';

describe('Interstitial page: interstitial', () => {
	beforeEach(() => {
		helpers.navigateToUrl(interstitial.pageLink);
		slots.invisibleHighImpact.waitForDisplayed();
	});

	it('Check if interstitial is displayed with close button and advertisement label', () => {
		$(interstitial.closeButton).waitForDisplayed(timeouts.standard);

		expect(slots.invisibleHighImpact.isDisplayedInViewport(), 'Interstitial not in the viewport').to
			.be.true;
	});

	it('Check if interstitial disappears after clicking close button', () => {
		expect(slots.invisibleHighImpact.isDisplayedInViewport(), 'Interstitial not in the viewport').to
			.be.true;
		$(interstitial.stopScrolling).waitForExist(timeouts.standard);

		interstitial.closeInterstitial();
		expect(slots.invisibleHighImpact.isDisplayedInViewport(), 'Interstitial still in the viewport')
			.to.be.false;
		$(interstitial.stopScrolling).waitForExist(timeouts.standard, true);
	});
});
