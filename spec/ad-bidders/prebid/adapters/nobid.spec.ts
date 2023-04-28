import { Nobid } from '@wikia/ad-bidders/prebid/adapters';
import { expect } from 'chai';

describe('Nobid bidder adapter', () => {
	it('can be enabled', () => {
		const nobid = new Nobid({
			enabled: true,
		});
		expect(nobid.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const nobid = new Nobid({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					siteId: '123456',
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(nobid.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[320, 50],
						],
					},
				},
				bids: [
					{
						bidder: 'nobid',
						params: {
							siteId: '123456',
						},
					},
				],
			},
		]);
	});
});
