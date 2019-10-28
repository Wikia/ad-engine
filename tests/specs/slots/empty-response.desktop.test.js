import { expect } from 'chai';
import { emptyResponse } from '../../pages/empty-response.page';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { slots } from '../../common/slot-registry';

describe('Empty response page: top leaderboard', () => {
	before(() => {
		helpers.navigateToUrl(emptyResponse.pageLink);
		$(emptyResponse.article).waitForDisplayed(timeouts.standard);
	});

	it('Check if top leaderboard is not visible', () => {
		slots.topLeaderboard.waitForSlotCollapsed();
		expect(slots.topLeaderboard.isDisplayedInViewport(), 'Slot in viewport').to.be.false;
	});

	it('Check if top boxad is not visible', () => {
		slots.topBoxad.waitForSlotCollapsed();
		expect(slots.topBoxad.isDisplayedInViewport(), 'Slot in viewport').to.be.false;
	});
});
