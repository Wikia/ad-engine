import { expect } from 'chai';
import { hiviUapStickyBfab } from '../../../pages/hivi-uap-sticky-bfab-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';
import { slots } from '../../../common/slot-registry';
import { queryStrings } from '../../../common/query-strings';
import { hiviUap } from '../../../pages/hivi-uap-ad.page';

describe('Desktop HiVi UAP sticky BFAB ads page: top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUapStickyBfab.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	it('Check if the line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(slots.topLeaderboard.lineItemId).to.equal(
			hiviUapStickyBfab.firstCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky BFAB ads page: top boxad', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUapStickyBfab.pageLink);
		slots.topBoxad.waitForDisplayed();
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(slots.topBoxad.lineItemId).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky BFAB ads page: incontent boxad', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUapStickyBfab.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed();
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('HiVi UAP sticky BFAB: bottom leaderboard Impact state: ', () => {
	before(() => {
		helpers.navigateToUrl(hiviUapStickyBfab.pageLink, queryStrings.getResolvedState(false));
		slots.topLeaderboard.waitForDisplayed();
		$(hiviUapStickyBfab.footer).scrollIntoView(false);
		hiviUap.closeLeaderboard();
		slots.bottomLeaderboard.scrollIntoView(true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(slots.bottomLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if impact dimensions are correct', () => {
		expect(slots.bottomLeaderboard.getAspectRatio()).to.be.above(3.9);
		expect(slots.bottomLeaderboard.getAspectRatio()).to.be.below(4.1);
	});

	it('Check if line item id is from the same campaign', () => {
		slots.bottomLeaderboard.waitForLineItemIdAttribute();
		expect(slots.bottomLeaderboard.lineItemId).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if slot is sticked', () => {
		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		$(hiviUapStickyBfab.footer).scrollIntoView(false);
		hiviUap.closeLeaderboard();
		slots.bottomLeaderboard.scrollIntoView(true);
		helpers.mediumScroll(350);
		slots.bottomLeaderboard.waitForDisplayed();
	});
});

describe('HiVi UAP sticky BFAB: bottom leaderboard Resolved state: ', () => {
	before(() => {
		helpers.navigateToUrl(hiviUapStickyBfab.pageLink, queryStrings.getResolvedState(true));
		slots.topLeaderboard.waitForDisplayed();
		$(hiviUapStickyBfab.footer).scrollIntoView(false);
		hiviUap.closeLeaderboard();
		slots.bottomLeaderboard.scrollIntoView(true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(slots.bottomLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if resolved dimensions are correct', () => {
		expect(slots.bottomLeaderboard.getAspectRatio()).to.be.above(9.9);
		expect(slots.bottomLeaderboard.getAspectRatio()).to.be.below(10.1);
	});

	it('Check if line item id is from the same campaign', () => {
		slots.bottomLeaderboard.waitForLineItemIdAttribute();
		expect(slots.bottomLeaderboard.lineItemId).to.equal(
			hiviUapStickyBfab.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if slot is sticked', () => {
		browser.refresh();
		slots.topLeaderboard.waitForDisplayed();
		$(hiviUapStickyBfab.footer).scrollIntoView(false);
		hiviUap.closeLeaderboard();
		slots.bottomLeaderboard.scrollIntoView(true);
		helpers.mediumScroll(350);
		slots.bottomLeaderboard.waitForDisplayed();
	});
});
