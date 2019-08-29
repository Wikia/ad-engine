import { expect } from 'chai';
import { Onemobile } from '../../../../src/ad-bidders/prebid/adapters/onemobile';

describe('Onemobile bidder adapter', () => {
	it('can be enabled', () => {
		const onemobile = new Onemobile({
			enabled: true,
		});

		expect(onemobile.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const onemobile = new Onemobile({
			enabled: true,
			siteId: '1122a3344b5566c778899d00',
			slots: {
				mobile_in_content: {
					size: [300, 250],
					pos: 'wikia_incontent_ab',
				},
			},
		});

		expect(onemobile.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				bids: [
					{
						bidder: 'onemobile',
						params: {
							dcn: '1122a3344b5566c778899d00',
							pos: 'wikia_incontent_ab',
						},
					},
				],
			},
		]);
	});
});
