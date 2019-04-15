import { expect } from 'chai';
import { abcdAd } from '../../../pages/abcd-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('ABCD ads page: top leaderboard', () => {
	let adStatus;

	before(() => {
		browser.url(abcdAd.pageLink);
	});

	beforeEach(() => {
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard, true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkUAPSizeSlotRatio(
			adSlots.topLeaderboard,
			abcdAd.abcdLeaderboardRatio,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if line item id is from the proper campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			abcdAd.topLeaderboardLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});

describe('ABCD ads page: video player in leaderboard', () => {
	let adStatus;

	before(() => {
		browser.url(abcdAd.pageLink);
	});
	beforeEach(() => {
		$(`${adSlots.topLeaderboard} ${abcdAd.videoPlayer}`).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(`${adSlots.topLeaderboard} ${abcdAd.videoPlayer}`);
		helpers.waitToStartPlaying();
	});

	it('Check if player is visible', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if unmuting the video works properly', () => {
		$(`${adSlots.topLeaderboard} ${abcdAd.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(abcdAd.unmuteButton).click();
		$(`${abcdAd.unmuteButton}${abcdAd.buttonIsOnClass}`).waitForExist(timeouts.standard, true);
	});
});
