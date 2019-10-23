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
		slots.topLeaderboard.waitForLineItemIdAttribute();
		expect(slots.topLeaderboard.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.topLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});

describe('Common slots: top boxad', () => {
	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		slots.topBoxad.waitForDisplayed();
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
		expect(slots.topBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		slots.topBoxad.waitForLineItemIdAttribute();
		expect(slots.topBoxad.lineItemId).to.equal(adSlots.inhouseLineItemId, 'Line item ID mismatch');
	});

	it('Check if redirect on click works', () => {
		expect(helpers.adRedirect(adSlots.topBoxad), 'Wrong link after redirect').to.be.true;
	});
});

describe('Common slots: rail module', () => {
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
	before(() => {
		helpers.navigateToUrl(commonAds.pageLink);
		helpers.mediumScroll(500);
		slots.incontentBoxad.waitForDisplayed();
		slots.incontentBoxad.scrollIntoView();
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
		expect(slots.topBoxad.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the inhouse campaign', () => {
		slots.incontentBoxad.waitForLineItemIdAttribute();
		expect(slots.incontentBoxad.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
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
		slots.bottomLeaderboard.waitForLineItemIdAttribute();
		expect(slots.bottomLeaderboard.lineItemId).to.equal(
			adSlots.inhouseLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if redirect on click works properly', () => {
		expect(helpers.adRedirect(adSlots.bottomLeaderboard), 'Wrong link after redirect').to.be.true;
	});
});
