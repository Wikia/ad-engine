import { expect } from 'chai';
import { floatingAd } from '../../../pages/floating-ad.page';
import { helpers } from '../../../common/helpers';
import { slots } from '../../../common/slot-registry';

describe('Floating ad page: incontent boxad', () => {
	before(() => {
		helpers.navigateToUrl(floatingAd.pageLink);
		helpers.mediumScroll(1000);
		slots.incontentBoxad.waitForDisplayed();
	});

	it('Check if slot scrolls with the page', () => {
		helpers.mediumScroll(2500);
		expect(slots.incontentBoxad.element.$(floatingAd.pinnedTopClass).isExisting()).to.be.false;
		expect(slots.incontentBoxad.isDisplayedInViewport()).to.be.true;
	});
});
