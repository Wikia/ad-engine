import { getDealsTargetingFromBid } from '@wikia/ad-bidders/prebid/prebid-helper';
import { expect } from 'chai';

describe('getDealsTargetingFromBid', () => {
	it('returns all hb_deal_* key-values', () => {
		const targeting = getDealsTargetingFromBid({
			adserverTargeting: {
				hb_deal_foo: 123,
				hb_bidder: 'foo',
				hb_deal_bar: 'abc',
				hb_pb: 12.02,
			},
		});

		expect(Object.keys(targeting).length).to.equal(2);
		expect(Object.keys(targeting)).to.deep.equal(['hb_deal_foo', 'hb_deal_bar']);
	});
});
