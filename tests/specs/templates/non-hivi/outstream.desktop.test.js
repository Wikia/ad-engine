import { expect } from 'chai';
import { outstream } from '../../../pages/outstream.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';

describe('Outstream ads', () => {
	let adStatus;

	afterEach(() => {
		helpers.slowScroll(-2000);
	});

	it('Check if video is visible in viewport', () => {
		browser.url(outstream.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted();
		helpers.slowScroll(outstream.pageLength);
		adStatus = adSlots.getSlotStatus(adSlots.incontentPlayer, true);
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if video is visible is floating', () => {
		browser.url(outstream.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted();
		helpers.slowScroll(outstream.pageLength);
		adStatus = adSlots.getSlotStatus(adSlots.incontentPlayer, true);
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
		helpers.waitForViewabillityCounted();
		helpers.slowScroll(-2000);
		browser.pause(timeouts.actions);
		expect($(outstream.floatingPlayer).isDisplayed()).to.be.true;
	});

	it('Check video with empty response', () => {
		helpers.navigateToUrl(outstream.pageLink, queryStrings.getEmptyResponse(true));
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted();
		helpers.slowScroll(outstream.pageLength);
		adStatus = adSlots.getSlotStatus(adSlots.incontentPlayer, true);
		expect(adStatus.inViewport, 'Not in viewport').to.be.false;
	});
});
