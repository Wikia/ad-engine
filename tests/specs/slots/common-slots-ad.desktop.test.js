import { expect } from 'chai';
import { commonAds } from '../../pages/common-ad.page';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';

describe('Common slots: top leaderboard', () => {
	let adStatus;

	before(() => {
		browser.url(commonAds.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topLeaderboard);
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
		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});

	//TODO visual
	xit('Check visual regression in top leaderboard', () => {
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.checkVisualRegression(browser.checkElement(adSlots.topLeaderboard));
	});
});

describe('Common slots: top boxad', () => {
	let adStatus;

	before(() => {
		browser.url(commonAds.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.topBoxad);
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
		expect(helpers.getLineItemId(adSlots.topBoxad)).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topBoxad), 'Wrong link after redirect').to.be.true;
	});

	//TODO visual
	xit('Check visual regression in top boxad', () => {
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		browser.checkElement(adSlots.topBoxad);
	});
});

describe('Common slots: rail module', () => {
	let adStatus;

	before(() => {
		browser.url(commonAds.pageLink);
		helpers.slowScroll(150);
		$(commonAds.railModule).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(commonAds.railModule, true);
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(adSlots.railModuleWidth);

		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if module is visible', () => {
		expect(adStatus.inViewport, 'Not visible').to.be.true;
	});
});

describe('Common slots: incontent boxad', () => {
	let adStatus;

	before(() => {
		browser.url(commonAds.pageLink);
		helpers.slowScroll(500);
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
		adStatus = adSlots.getSlotStatus(adSlots.incontentBoxad, true);
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
		expect(helpers.getLineItemId(adSlots.incontentBoxad)).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.incontentBoxad), 'Wrong link after redirect').to.be.true;
	});

	// TODO Visual
	xit('Check visual regression in incontent boxad', () => {
		$(adSlots.incontentBoxad).waitForDisplayed(timeouts.standard);
		browser.checkElement(adSlots.incontentBoxad);
	});
});

describe('Common slots: bottom leaderboard', () => {
	let adStatus;

	before(() => {
		browser.url(commonAds.pageLink);
		helpers.slowScroll(6000);
		$(adSlots.bottomLeaderboard).waitForDisplayed(timeouts.standard);
	});

	it('Check if dimensions are correct', () => {
		const dimensions = adSlots.checkSlotSize(
			adSlots.bottomLeaderboard,
			adSlots.leaderboardWidth,
			adSlots.leaderboardHeight,
		);

		adStatus = adSlots.getSlotStatus(adSlots.bottomLeaderboard);
		expect(dimensions.status, dimensions.capturedErrors).to.be.true;
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.bottomLeaderboard);
		expect(helpers.getLineItemId(adSlots.bottomLeaderboard)).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});
