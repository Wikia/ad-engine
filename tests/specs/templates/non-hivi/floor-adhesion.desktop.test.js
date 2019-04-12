import { expect } from 'chai';
import { floorAdhesion } from '../../../pages/floor-adhesion.page';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { adSlots } from '../../../common/ad-slots';

// TODO Fix template
xdescribe('Floor adhesion page: floor adhesion', () => {
	before(() => {
		browser.url(floorAdhesion.pageLink);
		$(floorAdhesion.outOfPageWrapper).waitForDisplayed(timeouts.standard);
	});

	it('Check if floor adhesion scrolls with the viewport', () => {
		$(floorAdhesion.closeButton).waitForDisplayed(timeouts.standard);

		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Floor adhesion not in the viewport',
		).to.be.true;
		helpers.slowScroll(1500);
		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Floor adhesion not in the viewport',
		).to.be.true;
	});

	it('Check if floor adhesion disappears after clicking close button', () => {
		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Floor adhesion not in the viewport',
		).to.be.true;

		$(floorAdhesion.closeButton).click();
		expect(
			$(adSlots.invisibleHighImpact).isDisplayedInViewport(),
			'Floor adhesion is in the viewport',
		).to.be.false;
	});
});
