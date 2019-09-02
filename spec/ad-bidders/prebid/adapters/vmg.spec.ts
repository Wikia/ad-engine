import { expect } from 'chai';
import { Vmg } from '../../../../src/ad-bidders/prebid/adapters/vmg';

describe('VMG bidder adapter', () => {
	it('can be enabled', () => {
		const vmg = new Vmg({
			enabled: true,
			slots: {},
		});

		expect(vmg.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const vmg = new Vmg({
			enabled: true,
			slots: {
				mobile_in_content: {
					sizes: [[300, 250]],
				},
			},
		});

		expect(vmg.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				bids: [
					{
						bidder: 'vmg',
						params: {},
					},
				],
			},
		]);
	});
});
