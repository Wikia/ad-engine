import { Triplelift } from '@wikia/ad-bidders/prebid/adapters';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Triplelift bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const triplelift = new Triplelift({
			enabled: true,
		});
		expect(triplelift.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const triplelift = new Triplelift({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					inventoryCodes: ['code1', 'code2'],
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(triplelift.prepareAdUnits()).to.deep.equal([
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
						bidder: 'triplelift',
						params: {
							inventoryCode: 'code1',
						},
					},
					{
						bidder: 'triplelift',
						params: {
							inventoryCode: 'code2',
						},
					},
				],
			},
		]);
	});
});
