import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

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

		browser.url(hiviUap.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);
		adSlots.waitForSlotResolved(adSlots.topLeaderboard, adSlots.resolvedDesktopRatio);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);
	});

	beforeEach(() => {
		browser.url(hiviUap.pageLink);
		helpers.slowScroll(-2000);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard);
	});

	afterEach(() => {
		helpers.slowScroll(-2000);
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
		browser.url(hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});

	it('Check if opening the full screen player works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUap.playerFullscreenButton}`).waitForEnabled(
			timeouts.standard,
		);
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.topLeaderboard} ${hiviUap.playerFullscreenButton}`).click();
		$(hiviUap.playerFullscreen).waitForDisplayed(timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUap.playPauseButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.topLeaderboard} ${hiviUap.playPauseButton}`).click();
		$(`${adSlots.topLeaderboard} ${hiviUap.playPauseButton}${hiviUap.buttonIsOn}`).waitForExist(
			timeouts.standard,
			true,
		);
	});

	it('Check if unmuting the video works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUap.volumeButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.topLeaderboard} ${hiviUap.volumeButton}`).click();
		$(`${adSlots.topLeaderboard} ${hiviUap.volumeButton}${hiviUap.buttonIsOn}`).waitForExist(
			timeouts.standard,
			true,
		);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);
		$(`${hiviUap.videoPlayer}${helpers.classHidden}`).waitForExist(timeouts.standard);
		helpers.switchToFrame(hiviUap.topPlayerFrame);
		$(hiviUap.replayOverlay).waitForDisplayed(timeouts.standard);
		$(hiviUap.replayOverlay).click();
		browser.frame();
		$(`${adSlots.topLeaderboard} ${hiviUap.videoPlayer}`).waitForExist(timeouts.standard);
	});
});

describe('Desktop HiVi UAP ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUap.pageLink);
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

describe('Desktop HiVi UAP ads page: incontent boxad', () => {
	beforeEach(() => {
		browser.url(hiviUap.pageLink);
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
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(7000);
		adSlots.waitForSlotExpanded(adSlots.bottomLeaderboard);

		defaultDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.defaultDesktopRatio,
		);

		hiviUap.openUapWithState(true, hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(7000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);

		browser.url(hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
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
		adStatus = adSlots.getSlotStatus(adSlots.bottomLeaderboard);
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
		browser.url(hiviUap.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(8000);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});
	afterEach(() => {
		helpers.slowScroll(-2000);
	});

	it('Check if opening the fullscreen player works properly', () => {
		$(`${adSlots.bottomLeaderboard} ${hiviUap.playerFullscreenButton}`).waitForEnabled(
			timeouts.standard,
		);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.playerFullscreenButton}`).click();
		$(hiviUap.playerFullscreen).waitForDisplayed(timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		$(`${adSlots.bottomLeaderboard} ${hiviUap.playPauseButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.playPauseButton}`).click();
		$(`${adSlots.bottomLeaderboard} ${hiviUap.playPauseButton}${hiviUap.buttonIsOn}`).waitForExist(
			timeouts.standard,
			true,
		);
	});

	it('Check if unmuting the video works properly', () => {
		$(`${adSlots.bottomLeaderboard} ${hiviUap.volumeButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.volumeButton}`).click();
		$(`${adSlots.bottomLeaderboard} ${hiviUap.volumeButton}${hiviUap.buttonIsOn}`).isExisting(
			timeouts.standard,
			true,
		);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUap.videoDuration);
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}${helpers.classHidden}`).waitForExist(
			timeouts.standard,
		);
		helpers.switchToFrame(hiviUap.bottomPlayerFrame);
		$(hiviUap.replayOverlay).waitForDisplayed(timeouts.standard);
		$(hiviUap.replayOverlay).click();
		browser.frame();
		$(`${adSlots.bottomLeaderboard} ${hiviUap.videoPlayer}`).waitForExist(timeouts.standard);
	});
});
