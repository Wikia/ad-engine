import { expect } from 'chai';
import { hiviUapCtp } from '../../../pages/hivi-uap-ctp-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Desktop HiVi UAP CTP ads page: top leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let scrollDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		hiviUapCtp.openUapWithState(false, hiviUapCtp.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);

		defaultDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.defaultDesktopRatio,
		);

		helpers.slowScroll(500);

		scrollDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);

		hiviUapCtp.openUapWithState(true, hiviUapCtp.pageLink);
		adSlots.waitForSlotExpanded(adSlots.topLeaderboard);

		refreshDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);

		browser.url(hiviUapCtp.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		$(hiviUapCtp.videoContainer).waitForDisplayed(timeouts.standard);
		$(hiviUapCtp.videoContainer).click();
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);
		browser.frame();
		adSlots.waitForSlotResolved(adSlots.topLeaderboard, adSlots.resolvedDesktopRatio);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);

		browser.frame();
	});

	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
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
			hiviUapCtp.firstCall,
			'Line item ID mismatch',
		);
	});

	it('Check if closing top leaderboard works properly', () => {
		$(hiviUapCtp.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
		$(hiviUapCtp.closeLeaderboardButton).click();
		adSlots.waitForSlotCollapsedManually(adSlots.topLeaderboard);
	});
});

describe('Desktop HiVi UAP CTP ads page: video player in top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		$(hiviUapCtp.videoContainer).click();
		helpers.waitToStartPlaying();
		browser.frame();
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});

	it('Check if opening the full screen player works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.playerFullscreenButton}`).waitForEnabled(
			timeouts.standard,
		);
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.playerFullscreenButton}`).click();
		$(hiviUapCtp.playerFullscreen).waitForDisplayed(timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}`).click();
		$(
			`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}${hiviUapCtp.buttonIsOn}`,
		).waitForExist(timeouts.standard, true);
	});

	it('Check if muting the video works properly', () => {
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}`).waitForEnabled(timeouts.standard);
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}`).click();
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}${hiviUapCtp.buttonIsOn}`).waitForExist(
			timeouts.standard,
		);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);
		$(`${hiviUapCtp.videoPlayer}${helpers.classHidden}`).waitForExist(timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		$(hiviUapCtp.replayOverlay).waitForDisplayed(timeouts.standard);
		$(hiviUapCtp.replayOverlay).click();
		browser.frame();
		$(`${adSlots.topLeaderboard} ${hiviUapCtp.videoPlayer}`).waitForExist(timeouts.standard);
	});
});

describe('Desktop HiVi UAP CTP ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUapCtp.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP CTP ads page: incontent boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapCtp.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP CTP ads page: bottom leaderboard', () => {
	let adStatus;
	let defaultDimensions;
	let refreshDimensions;
	let videoFinishedDimensions;

	before(() => {
		hiviUapCtp.openUapWithState(false, hiviUapCtp.pageLink, adSlots.topLeaderboard);
		helpers.slowScroll(7000);
		adSlots.waitForSlotExpanded(adSlots.bottomLeaderboard);

		defaultDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.defaultDesktopRatio,
		);

		hiviUapCtp.openUapWithState(true, hiviUapCtp.pageLink, adSlots.topLeaderboard);

		helpers.slowScroll(7000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);

		helpers.openUrlAndWaitForSlot(hiviUapCtp.pageLink, adSlots.topLeaderboard);
		helpers.slowScroll(7000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);

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
			hiviUapCtp.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});

describe('Desktop HiVi UAP CTP ads page: video player in bottom leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		helpers.slowScroll(7000);
		helpers.switchToFrame(hiviUapCtp.bottomPlayerFrame);
		$(hiviUapCtp.videoContainer).waitForDisplayed(timeouts.standard);
		$(hiviUapCtp.videoContainer).click();
		helpers.waitToStartPlaying();
		browser.frame();
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
	});

	it('Check if opening the fullscreen player works properly', () => {
		$(hiviUapCtp.playerFullscreenButton).waitForEnabled(timeouts.standard);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.playerFullscreenButton}`).click();
		$(hiviUapCtp.playerFullscreen).waitForDisplayed(timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		$(hiviUapCtp.playPauseButton).waitForEnabled(timeouts.standard);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.playPauseButton}`).click();
		$(`${hiviUapCtp.playPauseButton}${hiviUapCtp.buttonIsOn}`).waitForExist(
			timeouts.standard,
			true,
		);
	});

	it('Check if muting the video works properly', () => {
		$(hiviUapCtp.volumeButton).waitForEnabled(timeouts.standard);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.volumeButton}`).click();
		$(`${hiviUapCtp.volumeButton}${hiviUapCtp.buttonIsOn}`).isExisting(timeouts.standard);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}${helpers.classHidden}`).waitForExist(
			timeouts.standard,
		);
		helpers.switchToFrame(hiviUapCtp.bottomPlayerFrame);
		$(hiviUapCtp.replayOverlay).waitForDisplayed(timeouts.standard);
		$(hiviUapCtp.replayOverlay).click();
		browser.frame();
		$(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`).waitForExist(timeouts.standard);
	});
});
