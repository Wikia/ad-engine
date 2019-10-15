import { expect } from 'chai';
import { asserts } from '../../common/asserts';
import { helpers } from '../../common/helpers';
import { prebid } from '../../pages/prebid.page';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';

describe('Bidders: Prebid template', () => {
	it('Check if wikia adapter creative is not rendered when there are no bids', () => {
		browser.url(prebid.pageLink);
		asserts.assertInhouseCampaign(slots.topLeaderboard);
	});

	it('Check if wikia adapter creative is rendered', () => {
		helpers.navigateToUrl(prebid.pageLink, queryStrings.getPrice(2000));
		asserts.assertWikiaAdapterCampaign(slots.topLeaderboard);
	});

	it('Check disabling top leaderboard', () => {
		helpers.navigateToUrl(
			prebid.pageLink,
			queryStrings.getTurnedOffSlots(prebid.availableSlots.topLeaderboard),
		);
		expect(slots.topLeaderboard.lineItemId).to.be.null;
	});

	it('Check disabling top boxad', () => {
		helpers.navigateToUrl(
			prebid.pageLink,
			queryStrings.getTurnedOffSlots(prebid.availableSlots.topBoxad),
		);
		expect(slots.topBoxad.lineItemId).to.be.null;
	});
});
