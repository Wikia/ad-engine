import { Verizon } from '@wikia/ad-bidders/prebid/adapters';
import { expect } from 'chai';

describe('Verizon bidder adapter', () => {
	it('can be enabled', () => {
		const verizon = new Verizon({
			enabled: true,
			dcn: '123456',
		});
		expect(verizon.enabled).to.equal(true);
		expect(verizon.dcn).to.equal('123456');
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const verizon = new Verizon({
			enabled: true,
			dcn: '123456',
			slots: {
				bottom_leaderboard: {
					pos: 'bottom_leaderboard',
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(verizon.prepareAdUnits()).to.deep.equal([
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
						bidder: 'verizon',
						params: {
							dcn: '123456',
							pos: 'bottom_leaderboard',
						},
					},
				],
			},
		]);
	});
});
