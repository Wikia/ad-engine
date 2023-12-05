import { MagniteS2s } from '@wikia/ad-bidders/prebid/adapters/magniteS2s';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Magnite bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const magnite = new MagniteS2s({
			enabled: true,
			slots: {},
		});

		expect(magnite.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const magnite = new MagniteS2s({
			enabled: true,
			slots: {
				top_boxad: {
					sizes: [[300, 250]],
				},
			},
		});

		expect(magnite.prepareAdUnits()).to.deep.equal([
			{
				code: 'top_boxad',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/top_boxad',
					},
				},
				bids: [
					{
						bidder: 'mgnipbs',
						params: {},
					},
				],
			},
		]);
	});
});
