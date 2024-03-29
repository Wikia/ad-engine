import { Rubicon } from '@wikia/ad-bidders/prebid/adapters/rubicon';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Rubicon bidder adapter', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
		context.set('custom.hasFeaturedVideo', true);
	});

	after(() => {
		context.remove('custom.hasFeaturedVideo');
	});

	it('can be enabled', () => {
		const rubicon = new Rubicon({
			enabled: true,
		});

		expect(rubicon.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		targetingServiceStub.dump.returns({
			testKeyval: 'yes',
			mappedVerticalName: 'gaming',
		});

		const rubicon = new Rubicon({
			enabled: true,
			accountId: 1234,
			slots: {
				featured: {
					siteId: '55111',
					sizeId: '101',
					zoneId: '88888',
					position: 'btf',
				},
			},
		});

		expect(rubicon.prepareAdUnits()).to.deep.equal([
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
						placement: PrebidVideoPlacements.IN_ARTICLE,
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
						bidder: 'rubicon',
						params: {
							accountId: 1234,
							siteId: '55111',
							zoneId: '88888',
							name: 'featured',
							position: 'btf',
							inventory: {
								lang: ['en'],
								mappedVerticalName: ['gaming'],
								pos: ['featured'],
								s1: ['not a top1k wiki'],
								src: ['gpt'],
								testKeyval: ['yes'],
							},
							video: {
								playerWidth: '640',
								playerHeight: '480',
								size_id: '101',
								language: 'en',
							},
						},
					},
				],
			},
		]);
	});
});
