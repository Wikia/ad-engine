import { Telaria } from '@wikia/ad-bidders/prebid/adapters/telaria';
import { expect } from 'chai';

describe('Telaria bidder adapter', () => {
	it('can be enabled', () => {
		const telaria = new Telaria({
			enabled: true,
		});

		expect(telaria.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const telaria = new Telaria({
			enabled: true,
			slots: {
				featured: {
					adCode: '111',
					supplyCode: '222',
				},
			},
		});

		expect(telaria.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'telaria',
						params: {
							adCode: '111',
							supplyCode: '222',
							videoId: 'featured',
						},
					},
				],
			},
		]);
	});
});
