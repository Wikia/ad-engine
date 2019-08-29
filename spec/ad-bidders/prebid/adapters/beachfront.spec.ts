import { expect } from 'chai';
import { Beachfront } from '../../../../src/ad-bidders/prebid/adapters/beachfront';

describe('Beachfront bidder adapter', () => {
	it('can be enabled', () => {
		const beachfront = new Beachfront({
			enabled: true,
		});

		expect(beachfront.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const beachfront = new Beachfront({
			enabled: true,
			slots: {
				mobile_in_content: {
					appId: '1122-3344-556677-8899-0000',
				},
			},
		});

		expect(beachfront.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'beachfront',
						params: {
							bidfloor: 0.01,
							appId: '1122-3344-556677-8899-0000',
						},
					},
				],
			},
		]);
	});
});
