import { expect } from 'chai';
import { AudienceNetwork } from '../../../../src/ad-bidders/prebid/adapters/audience-network';

describe('AudienceNetwork bidder adapter', () => {
	it('can be enabled', () => {
		const audienceNetwork = new AudienceNetwork({
			enabled: true,
		});

		expect(audienceNetwork.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const audienceNetwork = new AudienceNetwork({
			enabled: true,
			slots: {
				mobile_in_content: {
					sizes: [[300, 250]],
					placementId: '112233445566_77889900',
				},
			},
		});

		expect(audienceNetwork.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250]],
					},
				},
				bids: [
					{
						bidder: 'audienceNetwork',
						params: {
							testMode: false,
							placementId: '112233445566_77889900',
						},
					},
				],
			},
		]);
	});
});
