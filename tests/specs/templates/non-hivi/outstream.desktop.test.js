import { expect } from 'chai';
import { outstream } from '../../../pages/outstream.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { queryStrings } from '../../../common/query-strings';

describe('Outstream ads', () => {
	let adStatus;

	beforeEach(() => {
		helpers.fastScroll(-2000);
	});

	it('Check if video is visible in viewport', () => {
		browser.url(outstream.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted(timeouts.standard);
		helpers.slowScroll(outstream.pageLength);
		adStatus = adSlots.getSlotStatus(adSlots.incontentPlayer, true);
		expect(adStatus.visible, 'Not in viewport').to.be.true;
	});

	it('Check if video is visible while floating', () => {
		browser.url(outstream.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForViewabillityCounted(timeouts.standard);
		helpers.slowScroll(outstream.pageLength);
		adStatus = adSlots.getSlotStatus(adSlots.incontentPlayer, true);
		expect($(adSlots.incontentPlayer).isDisplayed(), 'Incontent not visible').to.be.true;
		helpers.waitForViewabillityCounted(timeouts.actions);
		helpers.fastScroll(-2000);
		helpers.slowScroll(outstream.pageLength);
		helpers.waitForViewabillityCounted(timeouts.actions);
		expect($(outstream.floatingPlayer).isExisting(), 'Floating not visible').to.be.true;
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
