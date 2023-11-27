import { Ogury } from '@wikia/ad-bidders/prebid/adapters/ogury';
import { expect } from 'chai';

describe('Ogury bidder adapter', () => {
	it('can be enabled', () => {
		const ogury = new Ogury({
			enabled: true,
		});

		expect(ogury.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const ogury = new Ogury({
			enabled: true,
			slots: {
				mobile_in_content: {
					sizes: [
						[300, 250],
						[320, 480],
					],
					adUnitId: 'aaaaa',
					assetKey: 'bbbbb',
				},
			},
		});

		expect(ogury.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[320, 480],
						],
					},
				},
				bids: [
					{
						bidder: 'ogury',
						params: {
							adUnitId: 'aaaaa',
							assetKey: 'bbbbb',
							skipSizeCheck: true,
						},
					},
				],
			},
		]);
	});
});
