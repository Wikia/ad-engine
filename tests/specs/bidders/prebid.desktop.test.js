import { expect } from 'chai';
import { asserts } from '../../common/asserts';
import { helpers } from '../../common/helpers';
import { prebid } from '../../pages/prebid.page';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';

describe('Bidders: Prebid template', () => {
	it('Check if wikia adapter creative is not rendered when there are no bids', () => {
		helpers.navigateToUrl(prebid.pageLink);
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

	it('Check whether part of bids is available even if auction is not completed', () => {
		helpers.navigateToUrl(
			prebid.pageLink,
			queryStrings.getPrice(2000),
			// 100,3000 configuration means that first bid is avaialble after 100ms
			// and all other bids are available after 3000ms which means that auction
			// did not fit in the 2000ms ad-engine timeout
			queryStrings.getTimeout('100,3000'),
			// TODO: remove this test case if we decide to abandon ADEN-10030 idea
			// TODO: remove below line and use latest version if we decide to release ADEN-10030 globally
			'prebid-version=v3.2.0/20200326-auction-fix.min.js',
		);

		asserts.assertWikiaAdapterCampaign(slots.topLeaderboard);
		asserts.assertInhouseCampaign(slots.topBoxad);
	});
});
