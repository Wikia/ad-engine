import { IndexExchange } from '@wikia/ad-bidders/prebid/adapters/index-exchange';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';

describe('IndexExchange bidder adapter', () => {
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
					},
				},
				bids: [
					{
						bidder: 'indexExchange',
						params: {
							siteId: '112233',
							size: [640, 480],
							video: {
								mimes: [
									'video/mp4',
									'video/x-flv',
									'video/webm',
									'video/ogg',
									'application/javascript',
								],
								minduration: 1,
								maxduration: 30,
								protocols: [2, 3, 5, 6],
								api: [2],
							},
						},
					},
				],
			},
		]);
	});
});
