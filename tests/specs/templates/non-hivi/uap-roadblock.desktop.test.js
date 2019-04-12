import { expect } from 'chai';
import { uapRoadblock } from '../../../pages/uap-roadblock.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Desktop uap roadblock page: top leaderboard', () => {
	let adStatus;

	beforeEach(() => {
		helpers.fastScroll(-2000);
		browser.url(uapRoadblock.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard, true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			uapRoadblock.topLeaderboardLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	// TODO Visual
	xit('Check visual regression in top leaderboard (resolved)', () => {
		helpers.refreshPageAndWaitForSlot(adSlots.topLeaderboard);
		$(adSlots.topLeaderboard).checkElement();
	});
});

describe('Desktop uap roadblock page: top boxad', () => {
	before(() => {
		helpers.fastScroll(-2000);
		browser.url(uapRoadblock.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			uapRoadblock.topBoxadLineItemId,
			'Line item ID mismatch',
		);
	});
});
