import { Gumgum } from '@wikia/ad-bidders/prebid/adapters/gumgum';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('GumGum bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const gumgum = new Gumgum({
			enabled: true,
			slots: {},
		});

		expect(gumgum.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const gumgum = new Gumgum({
			enabled: true,
			slots: {
				mobile_in_content: {
					sizes: [[300, 250]],
					inScreen: '11223344',
				},
			},
		});

		expect(gumgum.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/mobile_in_content',
					},
				},
				bids: [
					{
						bidder: 'gumgum',
						params: {
							inScreen: '11223344',
						},
					},
				],
			},
		]);
	});
});
