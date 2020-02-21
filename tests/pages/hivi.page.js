import { expect } from 'chai';
import { timeouts } from '../common/timeouts';
import { navbarPage } from './navbar.page';
import { slots } from '../common/slot-registry';

export class HiviPage {
	constructor() {
		this.unstickEvent = 'force-unstick';
		this.closeButtonSelector = '.button-close.button-unstick';
		this.replayButtonSelector = '.replay-overlay';
		this.videoSelector = 'video.porvata-video';
		this.hiddenVideoSelector = '.video-player.hide';
		this.videoIframe = 'div[id^="google_ads_iframe_/5441"] iframe';
		this.desktopImpactAspectRatio = 4;
		this.desktopResolvedAspectRatio = 10;
		this.mobileImpactAspectRatio = 1.77;
		this.mobileResolvedAspectRatio = 3;
		this.bfaaLineItemId = '4518371940';
	}

	isSticked(slot) {
		return slot.relativeLocationToViewport === 0;
	}

	isAboveTheViewport(slot) {
		return slot.relativeLocationToViewport + slot.size.height < 0;
	}

	isVideoPaused(slotSelector) {
		return browser.execute(
			(givenSlotSelector, videoSlotSelector) =>
				document.querySelector(`${givenSlotSelector} ${videoSlotSelector}`).paused,
			slotSelector,
			this.videoSelector,
		);
	}

	closeUap() {
		$(this.closeButtonSelector).waitForDisplayed(timeouts.standard);
		$(this.closeButtonSelector).click();
		$(this.closeButtonSelector).waitForDisplayed(timeouts.standard, true);
		this.waitForVideoTransformation(2000);
	}

	isReplayDisplayed(slot) {
		browser.switchToFrame(slot.element.$(this.videoIframe));
		const replayState = $(this.replayButtonSelector).isDisplayed();

		browser.switchToFrame(null);

		return replayState;
	}

	clickReplay(slot) {
		browser.switchToFrame(slot.element.$(this.videoIframe));
		$(this.replayButtonSelector).waitForExist(timeouts.standard);
		$(this.replayButtonSelector).click();
		browser.switchToFrame(null);
		this.waitForVideoToProgress(5000, slot);
	}

	waitForVideoTransformation(timeout = timeouts.actions) {
		browser.pause(timeout);
	}

	waitForVideoToProgress(videoDuration, slot = slots.topLeaderboard) {
		slot.element.$(this.hiddenVideoSelector).waitForExist(timeouts.standard, true);
		browser.pause(videoDuration);
	}

	assertHiViFanTakeoverAdSlot({
		slot = slots.topLeaderboard,
		aspectRatio,
		isCloseButtonDisplayed,
		isReplayButtonDisplayed,
		isSticked,
		isAboveTheViewport,
		isVideoPlaying,
	}) {
		expect(slot.isDisplayed(), `${slot.slotName} is not displayed`).to.be.true;
		expect(this.isSticked(slot)).to.equal(isSticked, `${slot.slotName} stickiness state`);
		expect(this.isAboveTheViewport(slot)).to.equal(
			isAboveTheViewport,
			`${slot.slotName} viewport position state`,
		);
		expect(slot.aspectRatio).to.be.within(
			aspectRatio - 0.5,
			aspectRatio + 0.5,
			`${slot.slotName} has incorrect ratio`,
		);

		if (isSticked) {
			expect(navbarPage.position).to.be.within(
				slot.height - 1.1,
				slot.height + 1.1,
				'Navbar in incorrect position',
			);
		} else {
			expect(navbarPage.relativePosition).to.equal(0, 'Navbar not on the top of the page');
		}

		expect($(this.closeButtonSelector).isDisplayed()).to.equal(
			isCloseButtonDisplayed,
			'Close button state',
		);
		expect(this.isReplayDisplayed(slot)).to.equal(isReplayButtonDisplayed, 'Replay button state');

		expect(this.isVideoPaused(slot.selector)).to.equal(!isVideoPlaying, 'Video playback state');
	}

	assertHiViStaticFanTakeoverAdSlot({
		slot = slots.topLeaderboard,
		aspectRatio,
		isCloseButtonDisplayed,
		isSticked,
		isAboveTheViewport,
	}) {
		expect(slot.isDisplayed(), `${slot.slotName} is not displayed`).to.be.true;
		expect(this.isSticked(slot)).to.equal(isSticked, `${slot.slotName} stickiness state`);
		expect(this.isAboveTheViewport(slot)).to.equal(
			isAboveTheViewport,
			`${slot.slotName} viewport position state`,
		);
		expect(slot.aspectRatio).to.be.within(
			aspectRatio - 0.5,
			aspectRatio + 0.5,
			`${slot.slotName} has incorrect ratio`,
		);

		if (isSticked) {
			expect(navbarPage.position).to.be.within(
				slot.height - 1.1,
				slot.height + 1.1,
				'Navbar in incorrect position',
			);
		} else {
			expect(navbarPage.relativePosition).to.equal(0, 'Navbar not on the top of the page');
		}

		expect($(this.closeButtonSelector).isDisplayed()).to.equal(
			isCloseButtonDisplayed,
			'Close button state',
		);
	}
}

export const hiviPage = new HiviPage();
