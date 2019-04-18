import { expect } from 'chai';
import { floatingAd } from '../../../pages/floating-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { helpers } from '../../../common/helpers';
import { timeouts } from '../../../common/timeouts';

describe('Floating ad page: incontent boxad', () => {
	before(() => {
		browser.url(floatingAd.pageLink);
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if slot scrolls with the page', () => {
		helpers.slowScroll(2500);
		expect($(`${adSlots.incontentBoxad}${floatingAd.pinnedTopClass}`).isExisting()).to.be.false;
	});
});
