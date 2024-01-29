import { IndexExchange } from '@wikia/ad-bidders/prebid/adapters/index-exchange';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('IndexExchange bidder adapter', () => {
	const EXPECTED_VIDEO_AD_UNIT_CONFIG = {
		code: 'featured',
		mediaTypes: {
			video: {
				context: 'instream',
				placement: PrebidVideoPlacements.IN_ARTICLE,
				playerSize: [640, 480],
				plcmt: [PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT],
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
						minduration: 1,
						maxduration: 30,
						protocols: [2, 3, 5, 6],
						api: [2],
						w: 640,
						h: 480,
					},
				},
			},
		],
	};
	const MOCKED_INITIAL_MEDIA_ID = '666';
	const EXPECTED_VIDEO_AD_UNIT_CONFIG_WITH_JWP_RTD_DATA = {
		...EXPECTED_VIDEO_AD_UNIT_CONFIG,
		ortb2Imp: {
			ext: {
				gpid: '/5441/something/_PB/featured',
				data: {
					jwTargeting: {
						mediaID: MOCKED_INITIAL_MEDIA_ID,
					},
				},
			},
		},
	};

	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	afterEach(() => {
		context.remove('bidders.prebid.forceInArticleVideoPlacement');
		context.remove('options.video.enableStrategyRules');
		context.remove('options.video.jwplayer.initialMediaId');
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

	it('prepareAdUnits returns data in correct shape for video', () => {
		context.set('slots.featured.isVideo', true);

		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {
				featured: {
					siteId: '112233',
				},
			},
		});

		expect(indexExchange.prepareAdUnits()).to.deep.equal([EXPECTED_VIDEO_AD_UNIT_CONFIG]);
	});

	it('prepareAdUnits returns data in correct shape when JWP RTD module is enabled for video', () => {
		context.set('options.video.enableStrategyRules', true); // we use JWP RTD when strategy rules are enabled
		context.set('options.video.jwplayer.initialMediaId', MOCKED_INITIAL_MEDIA_ID);
		context.set('slots.featured.isVideo', true);

		const indexExchange = new IndexExchange({
			enabled: true,
			slots: {
				featured: {
					siteId: '112233',
				},
			},
		});

		expect(indexExchange.prepareAdUnits()).to.deep.equal([
			EXPECTED_VIDEO_AD_UNIT_CONFIG_WITH_JWP_RTD_DATA,
		]);
	});
});
