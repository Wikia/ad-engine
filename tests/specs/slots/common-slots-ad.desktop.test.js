import { expect } from 'chai';
import { commonAds } from '../../pages/common-ad.page';
import { slots } from '../../common/slot-registry';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Common slots', () => {
	describe('top leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(commonAds.pageLink);
			slots.topLeaderboard.waitForDisplayed();
		});

		it('Check if dimensions are correct', () => {
			expect(slots.topLeaderboard.size.height).to.equal(commonAds.topLeaderboardData.height);
			expect(slots.topLeaderboard.size.width).to.equal(commonAds.topLeaderboardData.width);
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if line item id is from the inhouse campaign', () => {
			slots.topLeaderboard.waitForLineItemIdAttribute();
			expect(slots.topLeaderboard.lineItemId).to.equal(
				commonAds.topLeaderboardData.lineItemId,
				'Line item ID mismatch',
			);
		});
	});

	describe('top boxad', () => {
		before(() => {
			helpers.navigateToUrl(commonAds.pageLink);
			slots.topBoxad.waitForDisplayed();
			slots.topBoxad.scrollIntoView();
		});

		it('Check if dimensions are correct', () => {
			expect(slots.topBoxad.size.height).to.equal(commonAds.topBoxadData.height);
			expect(slots.topBoxad.size.width).to.equal(commonAds.topBoxadData.width);
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.topBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if line item id is from the inhouse campaign', () => {
			slots.topBoxad.waitForLineItemIdAttribute();
			expect(slots.topBoxad.lineItemId).to.equal(
				commonAds.topBoxadData.lineItemId,
				'Line item ID mismatch',
			);
		});
	});

	describe('rail module', () => {
		before(() => {
			helpers.navigateToUrl(commonAds.pageLink);
			$(commonAds.railModule).waitForDisplayed(timeouts.standard);
			$(commonAds.railModule).scrollIntoView();
		});

		it('Check if dimensions are correct', () => {
			expect($(commonAds.railModule).getSize('height')).to.equal(commonAds.railData.height);
			expect($(commonAds.railModule).getSize('width')).to.equal(commonAds.railData.width);
		});

		it('Check if slot is visible in viewport', () => {
			expect($(commonAds.railModule).isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});
	});

	describe('incontent boxad', () => {
		before(() => {
			helpers.navigateToUrl(commonAds.pageLink);
			slots.incontentBoxad.scrollIntoView();
			slots.incontentBoxad.waitForDisplayed();
		});

		it('Check if dimensions are correct', () => {
			expect(slots.incontentBoxad.size.height).to.equal(commonAds.incontentBoxadData.height);
			expect(slots.incontentBoxad.size.width).to.equal(commonAds.incontentBoxadData.width);
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.incontentBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if line item id is from the inhouse campaign', () => {
			slots.incontentBoxad.waitForLineItemIdAttribute();
			expect(slots.incontentBoxad.lineItemId).to.equal(
				commonAds.incontentBoxadData.lineItemId,
				'Line item ID mismatch',
			);
		});
	});

	describe('bottom leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(commonAds.pageLink);
			slots.bottomLeaderboard.scrollIntoView();
			slots.bottomLeaderboard.waitForDisplayed();
			helpers.mediumScroll(100);
		});

		it('Check if dimensions are correct', () => {
			expect(slots.bottomLeaderboard.size.height).to.equal(commonAds.bottomLeaderboardData.height);
			expect(slots.bottomLeaderboard.size.width).to.equal(commonAds.bottomLeaderboardData.width);
		});

		it('Check if slot is visible in viewport', () => {
			expect(slots.bottomLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
		});

		it('Check if line item id is from the inhouse campaign', () => {
			slots.bottomLeaderboard.waitForLineItemIdAttribute();
			expect(slots.bottomLeaderboard.lineItemId).to.equal(
				commonAds.bottomLeaderboardData.lineItemId,
				'Line item ID mismatch',
			);
		});
	});
});
