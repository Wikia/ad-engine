import { Freewheel } from '@wikia/ad-bidders/prebid/adapters/freewheel';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Freewheel bidder adapter', () => {
	it('can be enabled', () => {
		const freewheel = new Freewheel({
			enabled: true,
		});

		expect(freewheel.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const freewheel = new Freewheel({
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

		expect(freewheel.prepareAdUnits()).to.deep.equal([
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
						bidder: 'freewheel',
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
		const freewheel = new Freewheel({
			enabled: true,
			slots: {
				featured: {
					cid: '1234',
					crid: '5678',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(freewheel.prepareAdUnits()).to.deep.equal([
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
						bidder: 'freewheel',
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
