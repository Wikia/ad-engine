import { RubiconDisplay } from '@wikia/ad-bidders/prebid/adapters/rubicon-display';
import { TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('RubiconDisplay bidder adapter', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	it('can be enabled', () => {
		const rubiconDisplay = new RubiconDisplay({
			enabled: true,
		});

		expect(rubiconDisplay.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		targetingServiceStub.dump.returns({
			mappedVerticalName: 'gaming',
		});

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
								loc: ['top'],
								mappedVerticalName: ['gaming'],
								pos: ['bottom_leaderboard'],
								s1: ['not a top1k wiki'],
								src: ['gpt'],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape with additional key-vals', () => {
		targetingServiceStub.dump.returns({
			testKeyval: 'yes',
			mappedVerticalName: 'gaming',
		});

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
	});
});
