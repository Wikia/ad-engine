import { expect } from 'chai';
import { hiviUapStickinessNotAllowed } from '../../../pages/hivi-uap-stickiness-not-allowed.page';
import { slots } from '../../../common/slot-registry';
import { helpers } from '../../../common/helpers';
import { hiviPage } from '../../../pages/hivi.page';

describe('Desktop HiVi UAP sticky ads page: top leaderboard', () => {
	beforeEach(() => {
		helpers.navigateToUrl(hiviUapStickinessNotAllowed.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	it('should check the state', () => {
		const expectedState = {
			aspectRatio: hiviPage.desktopResolvedAspectRatio,
			isCloseButtonDisplayed: false,
			isReplayButtonDisplayed: false,
			isSticked: false,
			isAboveTheViewport: true,
		};

		helpers.mediumScroll(1000);
		hiviPage.assertHiViStaticFanTakeoverAdSlot(expectedState);
	});

	it('Check if the line item id is from the same campaign', () => {
		slots.topLeaderboard.waitForLineItemIdAttribute();
		expect(slots.topLeaderboard.lineItemId).to.equal(
			hiviUapStickinessNotAllowed.firstCall,
			'Line item ID mismatch',
		);
	});
});
