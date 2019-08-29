import { PrebidProvider } from '@wikia/ad-bidders/prebid';

export class PrebidBidFactory {
	static readonly fakeBid: PrebidBidResponse = {
		cpm: 0.05,
		status: 'available',
		bidderCode: 'bidderA',
		timeToRespond: 2000,
		getStatusCode: () => PrebidProvider.validResponseStatusCode,
	} as PrebidBidResponse;

	static getBid(bid: Partial<PrebidBidResponse>): PrebidBidResponse {
		return {
			...PrebidBidFactory.fakeBid,
			...bid,
		};
	}
}
