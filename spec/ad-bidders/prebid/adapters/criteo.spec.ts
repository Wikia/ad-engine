import { Criteo } from '@wikia/ad-bidders/prebid/adapters';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Criteo bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

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
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/bottom_leaderboard',
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
