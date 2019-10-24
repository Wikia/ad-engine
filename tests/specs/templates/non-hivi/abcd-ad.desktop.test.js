import { expect } from 'chai';
import { abcdAd } from '../../../pages/abcd-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('ABCD ads page: top leaderboard', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(abcdAd.pageLink);
	});

	beforeEach(() => {
		slots.topLeaderboard.waitForDisplayed();
		adStatus = slots.topLeaderboard.status;
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
		slots.topLeaderboard.waitForLineItemIdAttribute();
		expect(slots.topLeaderboard.lineItemId).to.equal(
			abcdAd.topLeaderboardLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});
});

describe('ABCD ads page: video player in leaderboard', () => {
	before(() => {
		helpers.navigateToUrl(abcdAd.pageLink);
	});
	beforeEach(() => {
		$(`${slots.topLeaderboard.selector} ${abcdAd.videoPlayer}`).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
	});

	it('Check if player is visible', () => {
		expect(
			$(`${slots.topLeaderboard.selector} ${abcdAd.videoPlayer}`).isDisplayedInViewport(),
			'Not in viewport',
		).to.be.true;
	});

	it('Check if unmuting the video works properly', () => {
		$(`${slots.topLeaderboard.selector} ${abcdAd.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
		$(abcdAd.unmuteButton).click();
		$(`${abcdAd.unmuteButton}${abcdAd.buttonIsOnClass}`).waitForExist(timeouts.standard, true);
	});
});
