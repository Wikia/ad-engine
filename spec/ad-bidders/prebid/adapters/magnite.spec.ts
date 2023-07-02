import { Magnite } from '@wikia/ad-bidders/prebid/adapters/magnite';
import { expect } from 'chai';

describe('Magnite bidder adapter', () => {
	it('can be enabled', () => {
		const magnite = new Magnite({
			enabled: true,
			slots: {},
		});

		expect(magnite.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const magnite = new Magnite({
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
				bids: [
					{
						bidder: 'mgnipbs',
						params: {
							name: 'top_boxad',
						},
					},
				],
			},
		]);
	});
});
