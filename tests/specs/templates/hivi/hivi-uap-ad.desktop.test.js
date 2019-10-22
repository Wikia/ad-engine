import { expect } from 'chai';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { slots } from '../../../common/slot-registry';
import { queryStrings } from '../../../common/query-strings';

describe('Desktop HiVi UAP ads page: video player in top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUap.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		helpers.waitToStartPlaying();
		$(`${slots.topLeaderboard.selector} ${hiviUap.videoPlayer}`).moveTo();
		browser.pause(timeouts.hover);
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

describe.only('Desktop HiVi UAP Impact state', () => {
	describe('Top Leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUap.pageLink, queryStrings.getResolvedState(false));
			slots.topLeaderboard.waitForDisplayed();
			browser.pause(timeouts.actions); // TODO Fix
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if impact dimensions are correct', () => {
			expect(slots.topLeaderboard.calculateApectRatio()).to.be.above(3.9);
			expect(slots.topLeaderboard.calculateApectRatio()).to.be.below(4.1);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topLeaderboard.waitForLineItemIdAttribute();
			expect(slots.topLeaderboard.lineItemId).to.equal(hiviUap.firstCall, 'Line item ID mismatch');
		});

		it('Check if closing top leaderboard works properly', () => {
			browser.refresh();
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(1000);
			$(hiviUap.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
			$(hiviUap.closeLeaderboardButton).click();
			helpers.mediumScroll(50);
			expect(slots.topLeaderboard.isDisplayedInViewport()).to.be.false;
		});
	});
	describe('Top Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUap.pageLink, queryStrings.getResolvedState(false));
			slots.topBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topBoxad.waitForLineItemIdAttribute();
			expect(slots.topBoxad.lineItemId).to.equal(hiviUap.secondCall, 'Line item ID mismatch');
		});
	});

	describe('Incontent Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUap.pageLink, queryStrings.getResolvedState(false));
			slots.incontentBoxad.scrollIntoView();
			slots.incontentBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.incontentBoxad.waitForLineItemIdAttribute();
			expect(slots.incontentBoxad.lineItemId).to.equal(hiviUap.secondCall, 'Line item ID mismatch');
		});
	});

	describe('Desktop HiVi UAP ads page: bottom leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUap.pageLink, queryStrings.getResolvedState(false));
			slots.bottomLeaderboard.scrollIntoView();
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.bottomLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if impact dimensions are correct', () => {
			expect(slots.bottomLeaderboard.calculateApectRatio()).to.be.above(3.9);
			expect(slots.bottomLeaderboard.calculateApectRatio()).to.be.below(4.1);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.bottomLeaderboard.waitForLineItemIdAttribute();
			expect(slots.bottomLeaderboard.lineItemId).to.equal(
				hiviUap.secondCall,
				'Line item ID mismatch',
			);
		});

		it('Check if closing top leaderboard works properly', () => {
			browser.refresh();
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(1000);
			$(hiviUap.closeLeaderboardButton).waitForDisplayed(timeouts.standard);
			$(hiviUap.closeLeaderboardButton).click();
			helpers.mediumScroll(50);
			expect(slots.topLeaderboard.isDisplayedInViewport()).to.be.false;
		});
	});
});
