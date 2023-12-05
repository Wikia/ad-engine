import { Openx } from '@wikia/ad-bidders/prebid/adapters/openx';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Openx bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const openx = new Openx({
			enabled: true,
		});

		expect(openx.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const openx = new Openx({
			enabled: true,
			delDomain: 'wikia.com',
			slots: {
				mobile_in_content: {
					sizes: [
						[300, 250],
						[320, 480],
					],
					unit: 11223344,
				},
			},
		});

		expect(openx.prepareAdUnits()).to.deep.equal([
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
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/mobile_in_content',
					},
				},
				bids: [
					{
						bidder: 'openx',
						params: {
							unit: 11223344,
							delDomain: 'wikia.com',
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for mobile video returns data in correct shape', () => {
		const openx = new Openx({
			enabled: true,
			delDomain: 'wikia.com',
			slots: {
				featured: {
					unit: '123456',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(openx.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'instream',
						mimes: ['video/mp4', 'video/x-flv'],
						playerSize: [640, 480],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/featured',
					},
				},
				bids: [
					{
						bidder: 'openx',
						params: {
							delDomain: 'wikia.com',
							unit: '123456',
						},
					},
				],
			},
		]);
	});
});
