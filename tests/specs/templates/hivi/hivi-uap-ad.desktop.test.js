import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { slots } from '../../../common/slot-registry';

describe('Desktop HiVi UAP ads page: top leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let scrollDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		hiviUap.openUapWithState(false, hiviUap.pageLink, adSlots.topLeaderboard);

		defaultDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.defaultDesktopRatio,
		);

		helpers.slowScroll(500);

		scrollDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);
		helpers.slowScroll(-2000);
		browser.pause(timeouts.actions);
		hiviUap.openUapWithState(true, hiviUap.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);

		refreshDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);

		helpers.navigateToUrl(hiviUap.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);
		adSlots.waitForSlotResolved(adSlots.topLeaderboard, adSlots.resolvedDesktopRatio);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);
	});

	beforeEach(() => {
		helpers.fastScroll(-2000);
		helpers.navigateToUrl(hiviUap.pageLink);
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

	it('Check if resolved dimensions after video finished playing are correct', () => {
		expect(videoFinishedDimensions.status, videoFinishedDimensions.capturedErrors).to.be.true;
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	it('Check if the line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUap.firstCall,
			'Line item ID mismatch',
		);
	});

	it('Check if closing top leaderboard works properly', () => {
		$(hiviUap.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
		$(hiviUap.closeLeaderboardButton).click();
		adSlots.waitForSlotCollapsedManually(adSlots.topLeaderboard);
	});
});

describe('Desktop HiVi UAP ads page: video player in top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitToStartPlaying();
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});
});

describe('Desktop HiVi UAP ads page: top boxad', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUap.pageLink);
		slots.topBoxad.waitForDisplayed();
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUap.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP ads page: incontent boxad', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUap.pageLink);
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUap.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP ads page: bottom leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		hiviUap.openUapWithState(false, hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.slowScroll(7000);
		adSlots.waitForSlotExpanded(adSlots.bottomLeaderboard);

		defaultDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.defaultDesktopRatio,
		);

		hiviUap.openUapWithState(true, hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.slowScroll(7000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);

		helpers.navigateToUrl(hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.reloadPageAndWaitForSlot(adSlots.topLeaderboard);
		helpers.slowScroll(7000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);
	});

	beforeEach(() => {
		adStatus = slots.bottomLeaderboard.status;
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
		helpers.waitForLineItemIdAttribute(adSlots.bottomLeaderboard);
		expect(helpers.getLineItemId(adSlots.bottomLeaderboard)).to.equal(
			hiviUap.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});

describe('Desktop HiVi UAP ads page: video player in bottom leaderboard', () => {
	beforeEach(() => {
		helpers.fastScroll(-2000);
		helpers.navigateToUrl(hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.slowScroll(8000);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});
});
