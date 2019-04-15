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
		browser.switchToFrame();
		adSlots.waitForSlotResolved(adSlots.topLeaderboard, adSlots.resolvedDesktopRatio);

		videoFinishedDimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			adSlots.resolvedDesktopRatio,
		);

		browser.switchToFrame();
	});

	beforeEach(() => {
		helpers.fastScroll(-2000);
		browser.url(hiviUapCtp.pageLink);
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
	});

	it('Check if video is visible', () => {
		expect($(hiviUapCtp.topPlayerFrame).isExisting()).to.be.true;
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
	});

	it('Check if player is visible', () => {
		expect($(hiviUapCtp.bottomPlayerFrame).isExisting()).to.be.true;
	});
});
