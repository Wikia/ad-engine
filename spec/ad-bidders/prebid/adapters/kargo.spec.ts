import { Kargo } from '@wikia/ad-bidders/prebid/adapters/kargo';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Kargo bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const kargo = new Kargo({
			enabled: true,
			slots: {},
		});

		expect(kargo.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const kargo = new Kargo({
			enabled: true,
			slots: {
				mobile_in_content: {
					sizes: [[300, 250]],
					placementId: '11223344',
				},
			},
		});

		expect(kargo.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				bids: [
					{
						bidder: 'kargo',
						params: {
							placementId: '11223344',
						},
					},
				],
			},
		]);
	});
});
