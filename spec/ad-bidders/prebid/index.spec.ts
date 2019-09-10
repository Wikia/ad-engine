import { PrebidProvider } from '@wikia/ad-bidders/prebid/index';
import { context } from '@wikia/ad-engine/services/context-service';
import { expect } from 'chai';

const bidderConfig = {
	lazyLoadingEnabled: false,
};

describe('PrebidProvider bidder', () => {
	it('can be initialized', () => {
		new PrebidProvider(bidderConfig);
	});

	describe('getTargetingKeys', () => {
		it('returns all pbjs keys to reset', () => {
			const prebid = new PrebidProvider(bidderConfig);

			context.set('slots.top_leaderboard.targeting', {
				src: 'foo',
				loc: 'top',
				hb_bidder: 'wikia',
				hb_pb: '20.0',
			});
			const keys = prebid.getTargetingKeys('top_leaderboard');

			expect(keys.length).to.equal(2);
			expect(keys).to.deep.equal(['hb_bidder', 'hb_pb']);
		});
	});

	describe('getDealsTargetingFromBid', () => {
		it('returns all hb_deal_* key-values', () => {
			const prebid = new PrebidProvider(bidderConfig);

			const targeting = prebid.getDealsTargetingFromBid({
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
});
