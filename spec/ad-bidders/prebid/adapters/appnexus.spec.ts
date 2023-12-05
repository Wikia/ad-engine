import { PrebidNativeConfig } from '@wikia/ad-bidders';
import { Appnexus } from '@wikia/ad-bidders/prebid/adapters/appnexus';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Appnexus bidder adapter', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	it('can be enabled', () => {
		const appnexus = new Appnexus({
			enabled: true,
		});

		expect(appnexus.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const appnexus = new Appnexus({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
			placements: {
				ent: '99220011',
				gaming: '99220022',
				life: '99220033',
				other: '99220044',
			},
		});

		expect(appnexus.prepareAdUnits()).to.deep.equal([
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
						bidder: 'appnexus',
						params: {
							placementId: '99220044',
							keywords: {
								pos: ['bottom_leaderboard'],
								src: ['gpt'],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape for native prebid config', () => {
		global.sandbox
			.stub(context, 'get')
			.withArgs('slots.bottom_leaderboard.isNative')
			.returns(true)
			.withArgs('bidders.prebid.native.enabled')
			.returns(true)
			.withArgs('bidders.prebid.appnexusNative.enabled')
			.returns(true)
			.withArgs('adUnitId')
			.returns('/5441/something/_{custom.pageType}/{slotConfig.adProduct}')
			.withArgs('custom.pageType')
			.returns('PB');

		const appnexus = new Appnexus({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
			placements: {
				ent: '99220011',
				gaming: '99220022',
				life: '99220033',
				other: '99220044',
			},
		});

		expect(appnexus.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					native: PrebidNativeConfig.getPrebidNativeMediaTypes('mobile'),
				},
				bids: [
					{
						bidder: 'appnexus',
						params: {
							placementId: '99220044',
							keywords: {
								pos: ['bottom_leaderboard'],
								src: [''],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape for directly passed placementId', () => {
		const appnexus = new Appnexus({
			enabled: true,
			slots: {
				'02_MR': {
					sizes: [
						[300, 250],
						[300, 600],
					],
					placementId: '99220055',
				},
			},
			placements: {
				other: '99220044',
			},
		});

		expect(appnexus.prepareAdUnits()).to.deep.equal([
			{
				code: '02_MR',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				},
				bids: [
					{
						bidder: 'appnexus',
						params: {
							placementId: '99220055',
							keywords: {
								pos: ['02_MR'],
								src: ['gpt'],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape with additional key-vals', () => {
		const appnexus = new Appnexus({
			enabled: true,
			slots: {
				'02_MR': {
					sizes: [
						[300, 250],
						[300, 600],
					],
					placementId: '99220055',
				},
			},
			placements: {
				other: '99220044',
			},
		});

		expect(appnexus.prepareAdUnits()).to.deep.equal([
			{
				code: '02_MR',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				},
				bids: [
					{
						bidder: 'appnexus',
						params: {
							placementId: '99220055',
							keywords: {
								src: ['gpt'],
								pos: ['02_MR'],
							},
						},
					},
				],
			},
		]);
	});

	it('getPlacement on mobile returns correct placementId', () => {
		const appnexus = new Appnexus({
			enabled: true,
			slots: {},
			placements: {
				ent: '99220011',
				gaming: '99220022',
				life: '99220033',
				other: '99220044',
			},
		});

		targetingServiceStub.get.withArgs('mappedVerticalName').returns('gaming');

		expect(appnexus.getPlacement('mobile')).to.equal('99220022');
	});
});
