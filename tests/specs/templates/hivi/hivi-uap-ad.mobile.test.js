import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { commonAds } from '../../../pages/common-ad.page';

describe('Mobile HiVi UAP ads page: top leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let scrollDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		browser.url(hiviUap.pageLink);
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

		refreshDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedMobileRatio,
		);

		helpers.reloadPageAndWaitForSlot(adSlots.topLeaderboard);
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);
		adSlots.waitForSlotResolved(adSlots.topLeaderboard, adSlots.resolvedMobileRatio);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedMobileRatio,
		);
	});

	beforeEach(() => {
		helpers.closeNewTabs();
		helpers.fastScroll(-5000);
		browser.url(hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(-2000);
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

	it('Check if resolved dimensions after video finished playing are correct', () => {
		expect(videoFinishedDimensions.status, videoFinishedDimensions.capturedErrors).to.be.true;
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check redirect to new page', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	it('Check if the line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUap.firstCall,
			'Line item ID mismatch',
		);
	});

	it('Check closing top leaderboard after clicking the button', () => {
		$(hiviUap.closeLeaderboardButton).waitForEnabled(timeouts.standard);
		$(hiviUap.closeLeaderboardButton).click();
		adSlots.waitForSlotCollapsed(adSlots.topLeaderboard);
	});
});

describe('Mobile HiVi UAP ads page: video player in top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
	});

	it('Check if video player exist', () => {
		expect($(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).isDisplayed()).to.be.true;
	});
});

describe('Mobile HiVi UAP ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUap.pageLink);
		helpers.slowScroll(5000);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUap.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Mobile HiVi UAP ads page: incontent boxad', () => {
	beforeEach(() => {
		browser.url(hiviUap.pageLink);
		$(commonAds.railModule).scrollIntoView();
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
		$(adSlots.incontentBoxad).scrollIntoView();
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUap.secondCall,
			'Line item ID mismatch',
		);
	});
});
