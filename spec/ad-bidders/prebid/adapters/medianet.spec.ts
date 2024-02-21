import { Medianet } from '@wikia/ad-bidders/prebid/adapters/medianet';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Medianet bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

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
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/bottom_leaderboard',
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
				testvideoadslot: {
					cid: '1234',
					crid: '5678',
				},
			},
		});
		context.set('slots.testvideoadslot.isVideo', true);

		expect(medianet.prepareAdUnits()).to.deep.equal([
			{
				code: 'testvideoadslot',
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
						placement: PrebidVideoPlacements.IN_ARTICLE,
						plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/testvideoadslot',
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
