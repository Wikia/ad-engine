import { expect } from 'chai';
import { Aol } from '../../../../src/ad-bidders/prebid/adapters/aol';

describe('Aol bidder adapter', () => {
	it('can be enabled', () => {
		const aol = new Aol({
			enabled: true,
		});

		expect(aol.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const aol = new Aol({
			enabled: true,
			network: '1234.1',
			slots: {
				mobile_top_leaderboard: {
					sizes: [[320, 50]],
					placement: '11223344',
					alias: '54321',
					sizeId: '0404',
				},
			},
		});

		expect(aol.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_top_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[320, 50]],
					},
				},
				bids: [
					{
						bidder: 'aol',
						params: {
							placement: '11223344',
							network: '1234.1',
							alias: '54321',
							sizeId: '0404',
						},
					},
				],
			},
		]);
	});
});
