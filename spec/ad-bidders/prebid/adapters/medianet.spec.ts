import { Medianet } from '@wikia/ad-bidders/prebid/adapters/medianet';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Medianet bidder adapter', () => {
	it('can be enabled', () => {
		const medianet = new Medianet({
			enabled: true,
		});

		expect(medianet.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const medianet = new Medianet({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
					cid: '1234',
					crid: '5678',
				},
			},
		});

		expect(medianet.prepareAdUnits()).to.deep.equal([
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
						bidder: 'medianet',
						params: {
							cid: '1234',
							crid: '5678',
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for video returns data in correct shape', () => {
		const medianet = new Medianet({
			enabled: true,
			slots: {
				featured: {
					cid: '1234',
					crid: '5678',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(medianet.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
						context: 'instream',
						api: [2],
						linearity: 1,
						mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
						maxduration: 30,
						protocols: [2, 3, 5, 6],
						playbackmethod: [2, 3],
					},
				},
				bids: [
					{
						bidder: 'medianet',
						params: {
							cid: '1234',
							crid: '5678',
							video: {
								w: '640',
								h: '480',
								mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
								playbackmethod: [2, 3],
								maxduration: 30,
								minduration: 1,
								startdelay: 0,
							},
						},
					},
				],
			},
		]);
	});
});
