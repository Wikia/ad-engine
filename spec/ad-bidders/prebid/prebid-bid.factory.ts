import { validResponseStatusCode } from '@wikia/ad-bidders/prebid/prebid-helper';

export class PrebidBidFactory {
	static readonly fakeBid: PrebidBidResponse = {
		cpm: 0.05,
		status: 'available',
		bidderCode: 'bidderA',
		timeToRespond: 2000,
		adserverTargeting: {},
		getStatusCode: () => validResponseStatusCode,
	} as PrebidBidResponse;

	static getBid(bid: Partial<PrebidBidResponse>): PrebidBidResponse {
		return {
			...PrebidBidFactory.fakeBid,
			...bid,
		};
	}
}
