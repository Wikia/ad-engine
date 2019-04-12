import { expect } from 'chai';
import { hiviUapStatic } from '../../../pages/hivi-uap-static-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Mobile HiVi UAP static ads page: top leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let scrollDimensions;
	let refreshDimensions;

	before(() => {
		browser.url(hiviUapStatic.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);

		defaultDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.defaultMobileRatio,
		);

		helpers.slowScroll(500);

		scrollDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedMobileRatio,
		);

		helpers.reloadPageAndWaitForSlot(adSlots.topLeaderboard);
		helpers.refreshPageAndWaitForSlot(adSlots.topLeaderboard);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);

		refreshDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedMobileRatio,
		);
	});

	beforeEach(() => {
		helpers.fastScroll(-2000);
		browser.url(hiviUapStatic.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if default dimensions are correct', () => {
		expect(defaultDimensions.status, defaultDimensions.capturedErrors).to.be.true;
	});

	it('Check if resolved dimensions after scroll are correct', () => {
		expect(scrollDimensions.status, scrollDimensions.capturedErrors).to.be.true;
	});

	it('Check if resolved dimensions after refresh are correct', () => {
		expect(refreshDimensions.status, refreshDimensions.capturedErrors).to.be.true;
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUapStatic.firstCall,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check if redirect on tap works', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	it('Check if closing top leaderboard works', () => {
		$(hiviUapStatic.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
		$(hiviUapStatic.closeLeaderboardButton).click();
		adSlots.waitForSlotCollapsedManually(adSlots.topLeaderboard);
	});

	// TODO Visual
	xit('Check visual regression in top leaderboard', () => {
		browser.checkElement(adSlots.topLeaderboard);
	});
});

describe('Mobile HiVi UAP static ads page: top boxad', () => {
	beforeEach(() => {
		helpers.fastScroll(-5000);
		browser.url(hiviUapStatic.pageLink);
		helpers.slowScroll(5000);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUapStatic.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Mobile HiVi UAP static ads page: incontent boxad', () => {
	before(() => {
		helpers.slowScroll(6000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapStatic.secondCall,
			'Line item ID mismatch',
		);
	});
});
