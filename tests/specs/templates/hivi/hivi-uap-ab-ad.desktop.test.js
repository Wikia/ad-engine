import { expect } from 'chai';
import { hiviUapAb } from '../../../pages/hivi-uap-ab-ad.page';
import { adSlots } from '../../../common/ad-slots';
import { timeouts } from '../../../common/timeouts';
import { helpers } from '../../../common/helpers';

describe('HiVi UAP AB ads page with uap_c', () => {
	let adStatus;

	before(() => {
		helpers.navigateToUrl(hiviUapAb.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.slowScroll(7000);
		adSlots.waitForSlotExpanded(adSlots.bottomLeaderboard);
	});

	beforeEach(() => {
		adStatus = adSlots.getSlotStatus(adSlots.bottomLeaderboard);
	});

	it('Check if slot is visible in viewport', () => {
		expect(adStatus.inViewport, 'Not in viewport').to.be.true;
	});

	it('Check if creative id is from the same campaign', () => {
		helpers.waitForLineItemIdAttribute(adSlots.bottomLeaderboard);

		expect(helpers.getLineItemId(adSlots.topLeaderboard)).to.equal(
			hiviUapAb.lineItemId,
			'Line item ID mismatch',
		);

		const topLeaderboardCreativeId = helpers.getCreativeId(adSlots.topLeaderboard);
		const bottomLeaderboardCreativeId = helpers.getCreativeId(adSlots.bottomLeaderboard);

		if (topLeaderboardCreativeId === hiviUapAb.aCreativeId) {
			expect(bottomLeaderboardCreativeId).to.equal(
				hiviUapAb.aCreativeId,
				'Bottom leaderboard creative ID mismatch',
			);
		} else {
			expect(topLeaderboardCreativeId).to.equal(
				hiviUapAb.bCreativeId,
				'Top leaderboard creative ID mismatch',
			);
			expect(bottomLeaderboardCreativeId).to.equal(
				hiviUapAb.bCreativeId,
				'Bottom leaderboard creative ID mismatch',
			);
		}
	});
});
