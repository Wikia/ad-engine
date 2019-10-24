import { expect } from 'chai';
import { hiviUapStatic } from '../../../pages/hivi-uap-static-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Mobile HiVi UAP static ads page: top leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let scrollDimensions;
	let refreshDimensions;

	before(() => {
		helpers.navigateToUrl(hiviUapStatic.pageLink);
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
		helpers.navigateToUrl(hiviUapStatic.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		adStatus = slots.topLeaderboard.status;
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
		slots.topLeaderboard.waitForLineItemIdAttribute();
		expect(slots.topLeaderboard.lineItemId).to.equal(
			hiviUapStatic.firstCall,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check if closing top leaderboard works', () => {
		$(hiviUapStatic.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
		$(hiviUapStatic.closeLeaderboardButton).click();
		adSlots.waitForSlotCollapsedManually(adSlots.topLeaderboard);
	});
});

describe('Mobile HiVi UAP static ads page: top boxad', () => {
	beforeEach(() => {
		helpers.fastScroll(-5000);
		helpers.navigateToUrl(hiviUapStatic.pageLink);
		helpers.slowScroll(5000);
		slots.topBoxad.waitForDisplayed();
	});

	it('Check if line item id is from the same campaign', () => {
		slots.topBoxad.waitForLineItemIdAttribute();
		expect(slots.topBoxad.lineItemId).to.equal(hiviUapStatic.secondCall, 'Line item ID mismatch');
	});
});

describe('Mobile HiVi UAP static ads page: incontent boxad', () => {
	before(() => {
		helpers.slowScroll(6000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		slots.incontentBoxad.waitForLineItemIdAttribute();
		expect(slots.incontentBoxad.lineItemId).to.equal(
			hiviUapStatic.secondCall,
			'Line item ID mismatch',
		);
	});
});
