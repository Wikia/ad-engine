import { Wikia } from '@wikia/ad-bidders/prebid/adapters/wikia';
import { expect } from 'chai';

describe('Wikia bidder adapter', () => {
	it('can be enabled', () => {
		const wikia = new Wikia({
			enabled: true,
		});

		expect(wikia.enabled).to.equal(false);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const wikia = new Wikia({
			enabled: true,
			slots: {
				mobile_top_leaderboard: {
					sizes: [[320, 50]],
				},
			},
		});

		expect(wikia.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_top_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[320, 50]],
					},
				},
				bids: [
					{
						bidder: 'wikia',
						params: {},
					},
				],
			},
		]);
	});
});
