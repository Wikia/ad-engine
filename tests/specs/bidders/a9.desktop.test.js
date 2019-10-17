import { expect } from 'chai';
import { asserts } from '../../common/asserts';
import { helpers } from '../../common/helpers';
import { a9 } from '../../pages/a9.page';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';

describe('Bidders: A9 template', () => {
	it('Check if wikia adapter creative is not rendered when there are no bids', () => {
		helpers.navigateToUrl(a9.pageLink);
		asserts.assertInhouseCampaign(slots.topLeaderboard);
	});

	it('Check if wikia adapter creative is rendered', () => {
		helpers.navigateToUrl(a9.pageLink, queryStrings.getPrice(2000));
		asserts.assertWikiaAdapterCampaign(slots.topLeaderboard);
	});

	it('Check disabling top leaderboard', () => {
		helpers.navigateToUrl(
			a9.pageLink,
			queryStrings.getTurnedOffSlots(a9.availableSlots.topLeaderboard),
		);
		expect(slots.topLeaderboard.lineItemId).to.be.null;
	});

	it('Check disabling top boxad', () => {
		helpers.navigateToUrl(a9.pageLink, queryStrings.getTurnedOffSlots(a9.availableSlots.topBoxad));
		expect(slots.topBoxad.lineItemId).to.be.null;
	});

	it('Check if a9 bid is rendered', () => {
		helpers.navigateToUrl(a9.pageLink);
		a9.enableA9Debug();
		asserts.assertAmazonCampaign(slots.topLeaderboard);
	});
});
