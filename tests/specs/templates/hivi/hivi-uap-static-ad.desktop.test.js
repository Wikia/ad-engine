import { expect } from 'chai';
import { hiviUapStatic } from '../../../pages/hivi-uap-static-ad.page';
import { slots } from '../../../common/slot-registry';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';
import { queryStrings } from '../../../common/query-strings';
import { hiviPage } from '../../../pages/hivi.page';

describe('Desktop HiVi UAP Impact state', () => {
	describe('Top Leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(false));
			slots.topLeaderboard.waitForDisplayed();
			browser.pause(timeouts.actions);
		});

		it('should check the state', () => {
			const expectedState = {
				aspectRatio: hiviPage.desktopImpactAspectRatio,
				isCloseButtonDisplayed: false,
				isReplayButtonDisplayed: false,
				isSticked: true,
				isAboveTheViewport: false,
			};

			hiviPage.waitForVideoToProgress(1000);
			hiviPage.assertHiViStaticFanTakeoverAdSlot(expectedState);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topLeaderboard.waitForLineItemIdAttribute();
			expect(slots.topLeaderboard.lineItemId).to.equal(
				hiviUapStatic.firstCall,
				'Line item ID mismatch',
			);
		});

		it('Check if closing top leaderboard works properly', () => {
			browser.refresh();
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(1000);
			hiviUap.closeLeaderboard();
			helpers.mediumScroll(50);
			expect(slots.topLeaderboard.isDisplayedInViewport()).to.be.false;
		});
	});

	describe('Top Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(false));
			slots.topBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topBoxad.waitForLineItemIdAttribute();
			expect(slots.topBoxad.lineItemId).to.equal(hiviUapStatic.secondCall, 'Line item ID mismatch');
		});
	});

	describe('Incontent Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(false));
			slots.incontentBoxad.scrollIntoView();
			slots.incontentBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.incontentBoxad.waitForLineItemIdAttribute();
			expect(slots.incontentBoxad.lineItemId).to.equal(
				hiviUapStatic.secondCall,
				'Line item ID mismatch',
			);
		});
	});

	describe('Desktop HiVi UAP ads page: bottom leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(false));
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(500);
			hiviUap.closeLeaderboard();
			slots.bottomLeaderboard.scrollIntoView();
			slots.bottomLeaderboard.scrollIntoView(true);
			helpers.mediumScroll(150);
		});

		it('should check the state', () => {
			const expectedState = {
				aspectRatio: hiviPage.desktopImpactAspectRatio,
				isCloseButtonDisplayed: false,
				isReplayButtonDisplayed: false,
				isSticked: false,
				isAboveTheViewport: false,
				slot: slots.bottomLeaderboard,
			};

			hiviPage.waitForVideoToProgress(1000, slots.bottomLeaderboard);
			hiviPage.assertHiViStaticFanTakeoverAdSlot(expectedState);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.bottomLeaderboard.waitForLineItemIdAttribute();
			expect(slots.bottomLeaderboard.lineItemId).to.equal(
				hiviUapStatic.secondCall,
				'Line item ID mismatch',
			);
		});
	});
});

describe('Desktop HiVi UAP Resolved state', () => {
	describe('Top Leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(true));
			slots.topLeaderboard.waitForDisplayed();
			browser.pause(timeouts.actions);
		});

		it('should check the state', () => {
			const expectedState = {
				aspectRatio: hiviPage.desktopResolvedAspectRatio,
				isCloseButtonDisplayed: false,
				isReplayButtonDisplayed: false,
				isSticked: true,
				isAboveTheViewport: false,
			};

			hiviPage.waitForVideoToProgress(1000);
			hiviPage.assertHiViStaticFanTakeoverAdSlot(expectedState);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topLeaderboard.waitForLineItemIdAttribute();
			expect(slots.topLeaderboard.lineItemId).to.equal(
				hiviUapStatic.firstCall,
				'Line item ID mismatch',
			);
		});

		it('Check if closing top leaderboard works properly', () => {
			browser.refresh();
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(1000);
			hiviUap.closeLeaderboard();
			helpers.mediumScroll(50);
			expect(slots.topLeaderboard.isDisplayedInViewport()).to.be.false;
		});
	});

	describe('Top Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(true));
			slots.topBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.topBoxad.waitForLineItemIdAttribute();
			expect(slots.topBoxad.lineItemId).to.equal(hiviUapStatic.secondCall, 'Line item ID mismatch');
		});
	});

	describe('Incontent Boxad', () => {
		beforeEach(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(true));
			slots.incontentBoxad.scrollIntoView();
			slots.incontentBoxad.waitForDisplayed();
		});

		it('Check if line item id is from the same campaign', () => {
			slots.incontentBoxad.waitForLineItemIdAttribute();
			expect(slots.incontentBoxad.lineItemId).to.equal(
				hiviUapStatic.secondCall,
				'Line item ID mismatch',
			);
		});
	});

	describe('Desktop HiVi UAP ads page: bottom leaderboard', () => {
		before(() => {
			helpers.navigateToUrl(hiviUapStatic.pageLink, queryStrings.getResolvedState(true));
			slots.topLeaderboard.waitForDisplayed();
			helpers.mediumScroll(500);
			hiviUap.closeLeaderboard();
			slots.bottomLeaderboard.scrollIntoView();
			slots.bottomLeaderboard.scrollIntoView(true);
			helpers.mediumScroll(150);
		});

		it('should check the state', () => {
			const expectedState = {
				aspectRatio: hiviPage.desktopResolvedAspectRatio,
				isCloseButtonDisplayed: false,
				isReplayButtonDisplayed: false,
				isSticked: false,
				isAboveTheViewport: false,
				slot: slots.bottomLeaderboard,
			};

			hiviPage.waitForVideoToProgress(1000, slots.bottomLeaderboard);
			hiviPage.assertHiViStaticFanTakeoverAdSlot(expectedState);
		});

		it('Check if line item id is from the same campaign', () => {
			slots.bottomLeaderboard.waitForLineItemIdAttribute();
			expect(slots.bottomLeaderboard.lineItemId).to.equal(
				hiviUapStatic.secondCall,
				'Line item ID mismatch',
			);
		});
	});
});
