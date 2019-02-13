import { expect } from 'chai';
import { IndexExchange } from '../../../../src/ad-bidders/prebid/adapters/index-exchange';

describe('IndexExchange bidder adapter', () => {
	it('can be enabled', () => {
		const indexExchange = new IndexExchange({
			enabled: true,
		});

		expect(indexExchange.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [[300, 250], [320, 50]],
					siteId: '112233',
				},
			},
		});

		expect(indexExchange.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[300, 250], [320, 50]],
					},
				},
				bids: [
					{
						bidder: 'indexExchange',
						params: {
							siteId: '112233',
							size: [300, 250],
						},
					},
					{
						bidder: 'indexExchange',
						params: {
							siteId: '112233',
							size: [320, 50],
						},
					},
				],
			},
		]);
	});
});
