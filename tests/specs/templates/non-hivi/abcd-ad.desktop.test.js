import { expect } from 'chai';
import { abcdAd } from '../../../pages/abcd-ad.page';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('ABCD ads page: top leaderboard', () => {
	before(() => {
		helpers.navigateToUrl(abcdAd.pageLink);
	});

	beforeEach(() => {
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitForAnimations();
	});

	it('Check if slot is visible in viewport', () => {
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if dimensions are correct', () => {
		expect(slots.topLeaderboard.aspectRatio).to.equal(abcdAd.abcdLeaderboardRatio);
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
		slots.topLeaderboard.element.$(abcdAd.videoPlayer).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
	});

	it('Check if player is visible', () => {
		expect(
			slots.topLeaderboard.element.$(abcdAd.videoPlayer).isDisplayedInViewport(),
			'Not in viewport',
		).to.be.true;
	});

	it('Check if unmuting the video works properly', () => {
		slots.topLeaderboard.element.$(abcdAd.videoPlayer).moveTo();
		helpers.waitForAnimations();
		$(abcdAd.unmuteButton).click();
		$(`${abcdAd.unmuteButton}${abcdAd.buttonIsOnClass}`).waitForExist(timeouts.standard, true);
	});
});
