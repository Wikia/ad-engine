import { AppnexusGroupM } from '@wikia/ad-bidders/prebid/adapters/appnexus-group-m';
import { expect } from 'chai';

describe('AppnexusGroupM bidder adapter', () => {
	it('can be enabled', () => {
		const appnexusGroupM = new AppnexusGroupM({
			enabled: true,
		});

		expect(appnexusGroupM.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const appnexusGroupM = new AppnexusGroupM({
			enabled: true,
			slots: {
				top_leaderboard: {
					sizes: [
						[728, 90],
						[970, 250],
						[970, 150],
					],
					placementId: 20917983,
				},
				top_boxad: {
					sizes: [
						[300, 250],
						[300, 600],
					],
					placementId: 20917989,
				},
			},
		});

		expect(appnexusGroupM.prepareAdUnits()).to.deep.equal([
			{
				code: 'top_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [
							[728, 90],
							[970, 250],
							[970, 150],
						],
					},
				},
				bids: [
					{
						bidder: 'appnexusGroupM',
						params: {
							placementId: 20917983,
						},
					},
				],
			},
			{
				code: 'top_boxad',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				},
				bids: [
					{
						bidder: 'appnexusGroupM',
						params: {
							placementId: 20917989,
						},
					},
				],
			},
		]);
	});
});
