import { expect } from 'chai';
import { asserts } from '../../common/asserts';
import { helpers } from '../../common/helpers';
import { a9 } from '../../pages/a9.page';
import { queryStrings } from '../../common/query-strings';
import { slots } from '../../common/slot-registry';
import { network } from '../../common/network';

describe('Bidders: A9 template', () => {
	before(() => {
		network.enableCapturing('ads?');
	});

	afterEach(() => {
		network.clearResponses();
	});

	after(() => {
		network.disableCapturing();
	});

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

	it('should send A9 params to GAM when enabled', () => {
		helpers.navigateToUrl(a9.pageLink);
		a9.enableA9Debug();

		// page reloads, we need to get new responses
		network.clearResponses();

		network.waitForResponse('top_leaderboard');

		const topLeaderboardRequest = network.filterResponses('top_leaderboard')[0];
		const url = topLeaderboardRequest.url;

		expect(url).to.include(encodeURIComponent('amznbid=testBid'));
		expect(url).to.include(encodeURIComponent('amzniid=testImpression-'));
		expect(url).to.include(encodeURIComponent('amznsz=728x90'));
		expect(url).to.include(encodeURIComponent('amznp=testP'));
	});

	it('should not send A9 params to GAM when disabled by CCPA opt-out', () => {
		helpers.navigateToUrl(a9.pageLink, 'opt-out-sale-status=true');
		a9.enableA9Debug();

		// page reloads, we need to get new responses
		network.clearResponses();

		network.waitForResponse('top_leaderboard');

		const topLeaderboardRequest = network.filterResponses('top_leaderboard')[0];
		const url = topLeaderboardRequest.url;

		expect(url).to.not.include('amznbid');
		expect(url).to.not.include('amzniid');
		expect(url).to.not.include('amznsz');
		expect(url).to.not.include('amznp');
	});
});
