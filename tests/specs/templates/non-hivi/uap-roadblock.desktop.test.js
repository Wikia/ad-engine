import { expect } from 'chai';
import { uapRoadblock } from '../../../pages/uap-roadblock.page';
import { slots } from '../../../common/slot-registry';
import { helpers } from '../../../common/helpers';

describe('Desktop uap roadblock page: top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(uapRoadblock.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	it('Check if slot is visible in viewport', () => {
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Not in viewport').to.be.true;
	});

	it('Check if line item id is from the same campaign', () => {
		slots.topLeaderboard.waitForLineItemIdAttribute();
		expect(slots.topLeaderboard.lineItemId).to.equal(
			uapRoadblock.topLeaderboardLineItemId,
			'Line item ID mismatch',
		);
	});

	it('Check if navbar is visible in viewport', () => {
		expect($(helpers.navbar).isDisplayedInViewport(), 'Navbar not visible').to.be.true;
	});
});

describe('Desktop uap roadblock page: top boxad', () => {
	before(() => {
		helpers.navigateToUrl(uapRoadblock.pageLink);
		slots.topBoxad.waitForDisplayed();
	});

	it('Check if line item id is from the same campaign', () => {
		slots.topBoxad.waitForLineItemIdAttribute();
		expect(slots.topBoxad.lineItemId).to.equal(
			uapRoadblock.topBoxadLineItemId,
			'Line item ID mismatch',
		);
	});
});
