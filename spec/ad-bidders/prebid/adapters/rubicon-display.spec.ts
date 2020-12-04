import { RubiconDisplay } from '@wikia/ad-bidders/prebid/adapters/rubicon-display';
import { context } from '@wikia/ad-engine/services/context-service';
import { expect } from 'chai';

describe('RubiconDisplay bidder adapter', () => {
	it('can be enabled', () => {
		const rubiconDisplay = new RubiconDisplay({
			enabled: true,
		});

		expect(rubiconDisplay.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const rubiconDisplay = new RubiconDisplay({
			enabled: true,
			accountId: 1234,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
					targeting: {
						loc: ['top'],
					},
					position: 'btf',
					siteId: '55111',
					zoneId: '88888',
				},
			},
		});

		expect(rubiconDisplay.prepareAdUnits()).to.deep.equal([
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
						bidder: 'rubicon_display',
						params: {
							accountId: 1234,
							siteId: '55111',
							zoneId: '88888',
							name: 'bottom_leaderboard',
							position: 'btf',
							keywords: ['rp.fastlane'],
							inventory: {},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape with additional keyvals', () => {
		context.set('targeting.testKeyval', 'yes');
		context.set('bidders.prebid.additionalKeyvals.rubicon', true);

		const rubiconDisplay = new RubiconDisplay({
			enabled: true,
			accountId: 1234,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
					targeting: {
						loc: ['top'],
					},
					position: 'btf',
					siteId: '55111',
					zoneId: '88888',
				},
			},
		});

		expect(rubiconDisplay.prepareAdUnits()).to.deep.equal([
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
						bidder: 'rubicon_display',
						params: {
							accountId: 1234,
							siteId: '55111',
							zoneId: '88888',
							name: 'bottom_leaderboard',
							position: 'btf',
							keywords: ['rp.fastlane'],
							inventory: {
								lang: ['en'],
								mappedVerticalName: ['gaming'],
								s1: ['not a top1k wiki'],
								src: ['gpt'],
								pos: ['bottom_leaderboard'],
								loc: ['top'],
								testKeyval: ['yes'],
							},
						},
					},
				],
			},
		]);

		context.set('bidders.prebid.additionalKeyvals.rubicon', false);
	});
});
