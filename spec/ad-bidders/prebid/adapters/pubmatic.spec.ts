import { Pubmatic } from '@wikia/ad-bidders/prebid/adapters/pubmatic';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Pubmatic bidder adapter', () => {
	const EXPECTED_VIDEO_AD_UNIT_CONFIG_DEFAULT = {
		code: 'featured',
		mediaTypes: {
			video: {
				playerSize: [640, 480],
				context: 'instream',
				placement: PrebidVideoPlacements.IN_ARTICLE,
			},
		},
		bids: [
			{
				bidder: 'pubmatic',
				params: {
					adSlot: '1636187@0x0',
					publisherId: '112233',
					video: {
						mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
						skippable: true,
						minduration: 1,
						maxduration: 30,
						startdelay: 0,
						playbackmethod: [2, 3],
						api: [2],
						protocols: [2, 3, 5, 6],
						linearity: 1,
						placement: PrebidVideoPlacements.IN_ARTICLE,
						plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
					},
				},
			},
		],
	};

	afterEach(() => {
		context.remove('bidders.prebid.forceInArticleVideoPlacement');
	});

	it('can be enabled', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
		});

		expect(pubmatic.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
			publisherId: '112233',
			slots: {
				mobile_in_content: {
					sizes: [
						[300, 250],
						[320, 480],
					],
					ids: [
						'/1234/MOBILE_IN_CONTENT_300x250@300x250',
						'/1234/MOBILE_IN_CONTENT_320x480@320x480',
					],
				},
			},
		});

		expect(pubmatic.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[320, 480],
						],
					},
				},
				bids: [
					{
						bidder: 'pubmatic',
						params: {
							adSlot: '/1234/MOBILE_IN_CONTENT_300x250@300x250',
							publisherId: '112233',
						},
					},
					{
						bidder: 'pubmatic',
						params: {
							adSlot: '/1234/MOBILE_IN_CONTENT_320x480@320x480',
							publisherId: '112233',
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for video returns data in correct shape', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
			publisherId: '112233',
			slots: {
				featured: {
					sizes: [[0, 0]],
					ids: ['1636187@0x0'],
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(pubmatic.prepareAdUnits()).to.deep.equal([EXPECTED_VIDEO_AD_UNIT_CONFIG_DEFAULT]);
	});
});
