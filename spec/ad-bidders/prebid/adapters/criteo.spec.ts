import { Criteo } from '@wikia/ad-bidders/prebid/adapters';
import { expect } from 'chai';

describe('Criteo bidder adapter', () => {
	it('can be enabled', () => {
		const criteo = new Criteo({
			enabled: true,
			networkId: '123456',
		});

		expect(criteo.enabled).to.equal(true);
		expect(criteo.networkId).to.equal('123456');
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const criteo = new Criteo({
			enabled: true,
			networkId: '123456',
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(criteo.prepareAdUnits()).to.deep.equal([
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
						bidder: 'criteo',
						params: {
							networkId: '123456',
						},
					},
				],
			},
		]);
	});
});
