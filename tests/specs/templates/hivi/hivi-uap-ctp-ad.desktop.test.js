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
		browser.waitForVisible(adSlots.topLeaderboard, timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		browser.waitForVisible(hiviUapCtp.videoContainer, timeouts.standard);
		browser.click(hiviUapCtp.videoContainer);
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
		browser.waitForVisible(adSlots.topLeaderboard, timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard);
	});

	afterEach(() => {
		browser.scroll(0, 0);
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
		expect(browser.isVisibleWithinViewport(helpers.navbar), 'Navbar not visible').to.be.true;
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
		browser.waitForVisible(hiviUapCtp.closeLeaderboardButton, timeouts.standard);
		browser.click(hiviUapCtp.closeLeaderboardButton);
		adSlots.waitForSlotCollapsedManually(adSlots.topLeaderboard);
	});
});

describe('Desktop HiVi UAP CTP ads page: video player in top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		browser.waitForVisible(adSlots.topLeaderboard, timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		browser.click(hiviUapCtp.videoContainer);
		helpers.waitToStartPlaying();
		browser.frame();
		browser
			.moveToObject(`${adSlots.topLeaderboard} ${hiviUapCtp.videoPlayer}`)
			.pause(timeouts.hover);
	});

	it('Check if opening the full screen player works properly', () => {
		browser.waitForEnabled(
			`${adSlots.topLeaderboard} ${hiviUapCtp.playerFullscreenButton}`,
			timeouts.standard,
		);
		browser.click(`${adSlots.topLeaderboard} ${hiviUapCtp.playerFullscreenButton}`);
		browser.waitForVisible(hiviUapCtp.playerFullscreen, timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		browser.waitForEnabled(
			`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}`,
			timeouts.standard,
		);
		browser.click(`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}`);
		browser.waitForExist(
			`${adSlots.topLeaderboard} ${hiviUapCtp.playPauseButton}${hiviUapCtp.buttonIsOn}`,
			timeouts.standard,
			true,
		);
	});

	it('Check if muting the video works properly', () => {
		browser.waitForEnabled(
			`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}`,
			timeouts.standard,
		);
		browser.click(`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}`);
		browser.waitForExist(
			`${adSlots.topLeaderboard} ${hiviUapCtp.volumeButton}${hiviUapCtp.buttonIsOn}`,
			timeouts.standard,
		);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);
		browser.waitForExist(`${hiviUapCtp.videoPlayer}${helpers.classHidden}`, timeouts.standard);
		helpers.switchToFrame(hiviUapCtp.topPlayerFrame);
		browser.waitForVisible(hiviUapCtp.replayOverlay, timeouts.standard);
		browser.click(hiviUapCtp.replayOverlay);
		browser.frame();
		browser.waitForExist(`${adSlots.topLeaderboard} ${hiviUapCtp.videoPlayer}`, timeouts.standard);
	});
});

describe('Desktop HiVi UAP CTP ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapCtp.pageLink);
		browser.waitForVisible(adSlots.topBoxad, timeouts.standard);
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
		browser.scroll(0, 1000);
		browser.waitForVisible(adSlots.incontentBoxad, timeouts.standard);
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
		browser.waitForVisible(adSlots.bottomLeaderboard, timeouts.standard);

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);

		helpers.openUrlAndWaitForSlot(hiviUapCtp.pageLink, adSlots.topLeaderboard);
		helpers.slowScroll(7000);
		browser.waitForVisible(adSlots.bottomLeaderboard, timeouts.standard);
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
		browser.waitForVisible(hiviUapCtp.videoContainer, timeouts.standard);
		browser.click(hiviUapCtp.videoContainer);
		helpers.waitToStartPlaying();
		browser.frame();
		browser
			.moveToObject(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`)
			.pause(timeouts.hover);
	});

	it('Check if opening the fullscreen player works properly', () => {
		browser.waitForEnabled(hiviUapCtp.playerFullscreenButton, timeouts.standard);
		browser
			.moveToObject(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`)
			.pause(timeouts.hover);
		browser.click(`${adSlots.bottomLeaderboard} ${hiviUapCtp.playerFullscreenButton}`);
		browser.waitForVisible(hiviUapCtp.playerFullscreen, timeouts.standard);
	});

	it('Check if pausing the video works properly', () => {
		browser.waitForEnabled(hiviUapCtp.playPauseButton, timeouts.standard);
		browser
			.moveToObject(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`)
			.pause(timeouts.hover);
		browser.click(`${adSlots.bottomLeaderboard} ${hiviUapCtp.playPauseButton}`);
		browser.waitForExist(
			`${hiviUapCtp.playPauseButton}${hiviUapCtp.buttonIsOn}`,
			timeouts.standard,
			true,
		);
	});

	it('Check if muting the video works properly', () => {
		browser.waitForEnabled(hiviUapCtp.volumeButton, timeouts.standard);
		browser
			.moveToObject(`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`)
			.pause(timeouts.hover);
		browser.click(`${adSlots.bottomLeaderboard} ${hiviUapCtp.volumeButton}`);
		browser.isExisting(`${hiviUapCtp.volumeButton}${hiviUapCtp.buttonIsOn}`, timeouts.standard);
	});

	it('Check if replaying the video works properly', () => {
		helpers.waitForVideoAdToFinish(hiviUapCtp.videoDuration);
		browser.waitForExist(
			`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}${helpers.classHidden}`,
			timeouts.standard,
		);
		helpers.switchToFrame(hiviUapCtp.bottomPlayerFrame);
		browser.waitForVisible(hiviUapCtp.replayOverlay, timeouts.standard);
		browser.click(hiviUapCtp.replayOverlay);
		browser.frame();
		browser.waitForExist(
			`${adSlots.bottomLeaderboard} ${hiviUapCtp.videoPlayer}`,
			timeouts.standard,
		);
	});
});
