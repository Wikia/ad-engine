import { Criteo } from '@wikia/ad-bidders/prebid/adapters/criteo';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';

describe('Criteo bidder adapter', () => {
	it('can be enabled', () => {
		const criteo = new Criteo({
			enabled: true,
			slots: {},
		});

		expect(criteo.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const criteo = new Criteo({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [[300, 250], [320, 50]],
					networkId: '112233',
				},
			},
		});

		expect(criteo.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[300, 250], [320, 50]],
					},
				},
				bids: [
					{
						bidder: 'criteo',
						params: {
							networkId: '112233',
							size: [300, 250],
						},
					},
					{
						bidder: 'criteo',
						params: {
							networkId: '112233',
							size: [320, 50],
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for video returns data in correct shape', () => {
		const criteo = new Criteo({
			enabled: true,
			slots: {
				featured: {
					zoneId: '112233',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(criteo.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
						context: 'instream',
						mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
						maxduration: 30,
						api: [2],
						protocols: [2, 3, 5, 6],
					},
				},
				bids: [
					{
						bidder: 'criteo',
						params: {
							zoneId: '112233',
							video: {
								skip: 0,
								playbackmethod: 1,
								placement: 1,
							},
						},
					},
				],
			},
		]);
	});
});
