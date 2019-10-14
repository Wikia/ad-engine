import { expect } from 'chai';
import { hiviUapStickyBfab } from '../../../pages/hivi-uap-sticky-bfab-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { slots } from '../../../common/slot-registry';

describe('Desktop HiVi UAP sticky BFAB ads page: top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapStickyBfab.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	it('Check if the line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUapStickyBfab.firstCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky BFAB ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapStickyBfab.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky BFAB ads page: incontent boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapStickyBfab.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed();
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky BFAB ads page: bottom leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		hiviUapStickyBfab.openUapWithState(false, hiviUapStickyBfab.pageLink, adSlots.topLeaderboard);
		helpers.slowScroll(3000);
		adSlots.waitForSlotExpanded(adSlots.bottomLeaderboard);

		defaultDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.defaultDesktopRatio,
		);

		hiviUapStickyBfab.openUapWithState(true, hiviUapStickyBfab.pageLink, adSlots.topLeaderboard);
		helpers.slowScroll(3000);
		$(adSlots.bottomLeaderboard).waitForExist(timeouts.standard);
		$(adSlots.bottomLeaderboard).scrollIntoView();

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);
		browser.url(hiviUapStickyBfab.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(3000);
		$(adSlots.bottomLeaderboard).waitForExist(timeouts.standard);
		$(adSlots.bottomLeaderboard).scrollIntoView();
		helpers.waitForVideoAdToFinish(hiviUapStickyBfab.videoDuration);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);
	});

	beforeEach(() => {
		helpers.fastScroll(-3000);
		adStatus = adSlots.getSlotStatus(adSlots.bottomLeaderboard, true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if default dimensions are correct', () => {
		expect(defaultDimensions.status, defaultDimensions.capturedErrors).to.be.true;
	});

	it('Check if resolved dimensions after refresh are correct', () => {
		expect(refreshDimensions.status, refreshDimensions.capturedErrors).to.be.true;
	});

	it('Check if resolved dimensions after video finished are correct', () => {
		expect(videoFinishedDimensions.status, videoFinishedDimensions.capturedErrors).to.be.true;
	});

	it('Check if line item id is from the same campaign', () => {
		slots.bottomLeaderboard.waitForLineItemIdAttribute();
		expect(slots.bottomLeaderboard.lineItemId).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		helpers.slowScroll(1000);
		slots.bottomLeaderboard.scrollIntoView();
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	it('Check if slot is sticked', () => {
		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitToStartPlaying();
		helpers.mediumScroll(2500);
		slots.bottomLeaderboard.scrollIntoView();
		expect(slots.bottomLeaderboard.isDisplayedInViewport()).to.be.true;
		helpers.mediumScroll(500);
		slots.bottomLeaderboard.waitForDisplayed();
	});
});
