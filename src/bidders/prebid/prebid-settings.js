import { transformPriceFromCpm } from './price-helper';

export function getSettings() {
	return {
		standard: {
			alwaysUseBid: false,
			adserverTargeting: [{
				key: 'hb_bidder',
				val: ({ bidderCode }) => bidderCode
			}, {
				key: 'hb_adid',
				val: ({ adId }) => adId
			}, {
				key: 'hb_pb',
				val: bidResponse => transformPriceFromCpm(bidResponse.cpm)
			}, {
				key: 'hb_size',
				val: ({ size }) => size
			}]
		}
	};
}
