import { expect } from 'chai';
import { Gumgum } from '../../../../src/ad-bidders/prebid/adapters/gumgum';

describe('GumGum bidder adapter', () => {
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
