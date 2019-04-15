import { expect } from 'chai';
import { hiviUapStickinessNotAllowed } from '../../../pages/hivi-uap-stickiness-not-allowed.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('Desktop HiVi UAP sticky ads page: top leaderboard', () => {
	beforeEach(() => {
		browser.url(hiviUapStickinessNotAllowed.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	it('Check if the line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUapStickinessNotAllowed.firstCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky ads page: top boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapStickinessNotAllowed.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			hiviUapStickinessNotAllowed.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky ads page: incontent boxad', () => {
	beforeEach(() => {
		browser.url(hiviUapStickinessNotAllowed.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed();
		helpers.slowScroll(1000);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			hiviUapStickinessNotAllowed.secondCall,
			'Line item ID mismatch',
		);
	});
});

describe('Desktop HiVi UAP sticky ads page: bottom leaderboard', () => {
	let adStatus;
	let refreshDimensions;

	before(() => {
		hiviUapStickinessNotAllowed.openUapWithState(
			true,
			hiviUapStickinessNotAllowed.pageLink,
			adSlots.topLeaderboard,
		);
		helpers.slowScroll(3000);
		$(adSlots.bottomLeaderboard).waitForExist(timeouts.standard);
		$(adSlots.bottomLeaderboard).scrollIntoView();

		refreshDimensions = adSlots.checkDerivativeSizeSlotRatio(
			adSlots.bottomLeaderboard,
			helpers.wrapper,
			adSlots.resolvedDesktopRatio,
		);
		browser.url(hiviUapStickinessNotAllowed.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(3000);
		$(adSlots.bottomLeaderboard).waitForExist(timeouts.standard);
		$(adSlots.bottomLeaderboard).scrollIntoView();
		helpers.waitForVideoAdToFinish(hiviUapStickinessNotAllowed.videoDuration);
	});

	beforeEach(() => {
		helpers.fastScroll(-5000);
		adStatus = adSlots.getSlotStatus(adSlots.bottomLeaderboard, true);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if slot dimensions are correct', () => {
		expect(refreshDimensions.status, refreshDimensions.capturedErrors).to.be.true;
	});

	it('Check if line item id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.bottomLeaderboard);
		expect(helpers.getLineItemId(adSlots.bottomLeaderboard)).to.equal(
			hiviUapStickinessNotAllowed.secondCall,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		helpers.slowScroll(1000);
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	it('Check if slot is sticked', () => {
		browser.refresh();
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitToStartPlaying();
		helpers.slowScroll(2500);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);
		expect($(adSlots.bottomLeaderboard).isDisplayedInViewport()).to.be.false;
		helpers.slowScroll(500, adSlots.bottomLeaderboard);
		expect($(adSlots.bottomLeaderboard).isDisplayed()).to.be.true;
	});
});
