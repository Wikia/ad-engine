import { Roundel } from '@wikia/ad-bidders/prebid/adapters/roundel';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Roundel bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const roundel = new Roundel({
			enabled: true,
		});

		expect(roundel.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const roundel = new Roundel({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
					siteId: '824040',
				},
			},
		});

		expect(roundel.prepareAdUnits()).to.deep.equal([
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
						bidder: 'roundel',
						params: {
							siteId: '824040',
							size: [300, 250],
						},
					},
					{
						bidder: 'roundel',
						params: {
							siteId: '824040',
							size: [320, 50],
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for video returns data in correct shape', () => {
		const roundel = new Roundel({
			enabled: true,
			slots: {
				featured: {
					siteId: '820935',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(roundel.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'instream',
						placement: PrebidVideoPlacements.IN_ARTICLE,
						playerSize: [640, 480],
						plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/featured',
					},
				},
				bids: [
					{
						bidder: 'roundel',
						params: {
							siteId: '820935',
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
