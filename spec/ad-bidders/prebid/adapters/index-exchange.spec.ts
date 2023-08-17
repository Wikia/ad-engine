import { IndexExchange } from '@wikia/ad-bidders/prebid/adapters/index-exchange';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('IndexExchange bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {},
		});

		expect(indexExchange.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
					siteId: '112233',
				},
			},
		});

		expect(indexExchange.prepareAdUnits()).to.deep.equal([
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

	it('prepareAdUnits for video returns data in correct shape', () => {
		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {
				featured: {
					siteId: '112233',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(indexExchange.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
						api: [2, 7],
						mimes: [
							'video/mp4',
							'video/x-flv',
							'video/webm',
							'video/ogg',
							'application/javascript',
						],
						protocols: [2, 3, 5, 6],
						playbackmethod: [2],
						plcmt: 2,
						placement: 5,
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/featured',
					},
				},
				bids: [
					{
						bidder: 'indexExchange',
						params: {
							siteId: '112233',
							size: [640, 480],
							video: {
								context: 'instream',
								playerSize: [640, 480],
								mimes: [
									'video/mp4',
									'video/x-flv',
									'video/webm',
									'video/ogg',
									'application/javascript',
								],
								protocols: [2, 3, 5, 6],
								api: [2, 7],
								playbackmethod: [2],
								w: 640,
								h: 480,
								minduration: 5,
								maxduration: 30,
								delivery: [2],
								linearity: 1,
								placement: 5,
								pos: 3,
							},
						},
					},
				],
			},
		]);
	});
});
