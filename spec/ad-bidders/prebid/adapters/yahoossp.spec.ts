import { YahooSsp } from '@wikia/ad-bidders/prebid/adapters';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('YahooSsp bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const yahooSsp = new YahooSsp({
			enabled: true,
		});
		expect(yahooSsp.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const yahooSsp = new YahooSsp({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					pubId: ['123456', '234567'],
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(yahooSsp.prepareAdUnits()).to.deep.equal([
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
						bidder: 'yahoossp',
						params: {
							pubId: '123456',
						},
					},
					{
						bidder: 'yahoossp',
						params: {
							pubId: '234567',
						},
					},
				],
			},
		]);
	});
});
