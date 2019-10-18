import { expect } from 'chai';
import { commonAds } from '../../pages/common-ad.page';
import { adSlots } from '../../common/ad-slots';
import { slots } from '../../common/slot-registry';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Common slots: top leaderboard', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		slots.topLeaderboard.waitForDisplayed();
		adStatus = slots.topLeaderboard.status;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.topLeaderboard,
			adSlots.leaderboardWidth,
			adSlots.leaderboardHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if slot has default classes', () => {
		const classAssertions = adSlots.checkSlotClasses(adSlots.topLeaderboard, [
			'i-am-the-default-class-added-on-create',
		]);

		expect(classAssertions.status, classAssertions.capturedErrors).to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topLeaderboard);
		expect(slots.topLeaderboard.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	//TODO visual
	it.skip('Check visual regression in top leaderboard', () => {
		slots.topLeaderboard.waitForDisplayed();
		helpers.checkVisualRegression(browser.checkElement(adSlots.topLeaderboard));
	});
});

describe('Common slots: top boxad', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		slots.topBoxad.waitForDisplayed();
		adStatus = slots.topBoxad.status;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.topBoxad,
			adSlots.boxadWidth,
			adSlots.boxadHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.topBoxad);
		expect(slots.topBoxad.lineItemId).to.equal(adSlots.inhouseLineItemId, 'Line item ID mismatch');
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topBoxad), 'Wrong link after redirect').to.be.true;
	});

	//TODO visual
	it.skip('Check visual regression in top boxad', () => {
		slots.topBoxad.waitForDisplayed();
		browser.checkElement(adSlots.topBoxad);
	});
});

describe('Common slots: rail module', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		helpers.slowScroll(150);
		$(commonAds.railModule).waitForDisplayed(timeouts.standard);
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			commonAds.railModule,
			adSlots.railModuleWidth,
			adSlots.railModuleHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if module is visible', () => {
		expect($(commonAds.railModule).isDisplayedInViewport(), 'Not visible').to.be.true;
	});
});

describe('Common slots: incontent boxad', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		helpers.slowScroll(500);
		slots.incontentBoxad.waitForDisplayed();
		slots.topBoxad.scrollIntoView();
		adStatus = slots.topBoxad.status;
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.incontentBoxad,
			adSlots.boxadWidth,
			adSlots.boxadHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.incontentBoxad);
		expect(slots.incontentBoxad.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.incontentBoxad), 'Wrong link after redirect').to.be.true;
	});

	// TODO Visual
	it.skip('Check visual regression in incontent boxad', () => {
		slots.incontentBoxad.waitForDisplayed();
		browser.checkElement(adSlots.incontentBoxad);
	});
});

describe('Common slots: bottom leaderboard', () => {
	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		slots.bottomLeaderboard.scrollIntoView();
		slots.bottomLeaderboard.waitForDisplayed();
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.bottomLeaderboard,
			adSlots.leaderboardWidth,
			adSlots.leaderboardHeight,
		);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if slot is visible', () => {
		expect(slots.bottomLeaderboard.isDisplayed(), 'Not displayed').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.bottomLeaderboard);
		expect(slots.bottomLeaderboard.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});
