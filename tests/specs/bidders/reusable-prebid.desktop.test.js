import { asserts } from '../../common/asserts';
import { helpers } from '../../common/helpers';
import { reusablePrebid } from '../../pages/reusable-prebid.page';
import { slots } from '../../common/slot-registry';

describe('Bidders: Reusable prebid template', () => {
	it('Check if wikia adapter creative is not rendered when there are no bids', () => {
		helpers.navigateToUrl(reusablePrebid.getLinkWithWikiaAdapterParameters());

		asserts.assertInhouseCampaign(slots.topLeaderboard);
	});

	it('Check if wikia adapter creative is rendered', () => {
		helpers.navigateToUrl(reusablePrebid.getLinkWithWikiaAdapterParameters(1410));

		asserts.assertWikiaAdapterCampaign(slots.topLeaderboard);
	});

	it('Check if wikia adapter creative is rendered for lazy loaded slot when prebid timeouts at the beginning', () => {
		helpers.navigateToUrl(reusablePrebid.getLinkWithWikiaAdapterParameters(1410, 0, true, 3000));

		asserts.assertInhouseCampaign(slots.topLeaderboard);

		browser.pause(1500);
		helpers.slowScroll(5000);

		asserts.assertWikiaAdapterCampaign(slots.repeatableBoxad2);
	});

	it('Check if wikia adapter creative is not rendered when limit of bids is reached', () => {
		helpers.navigateToUrl(reusablePrebid.getLinkWithWikiaAdapterParameters(1410, 3, true));

		asserts.assertWikiaAdapterCampaign(slots.topLeaderboard);
		asserts.assertWikiaAdapterCampaign(slots.repeatableBoxad1);

		helpers.mediumScroll(5000);

		asserts.assertInhouseCampaign(slots.repeatableBoxad2);
	});
});
