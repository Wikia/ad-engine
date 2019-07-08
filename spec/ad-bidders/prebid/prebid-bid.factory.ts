import { Prebid, PrebidBid } from '../../../src/ad-bidders/prebid';

export class PrebidBidFactory {
	static readonly fakeBid: PrebidBid = {
		cpm: 0.05,
		status: 'available',
		bidderCode: 'bidderA',
		timeToRespond: 2000,
		getStatusCode: () => Prebid.validResponseStatusCode,
	};

	static getBid(bid: Partial<PrebidBid>): PrebidBid {
		return {
			...PrebidBidFactory.fakeBid,
			...bid,
		};
	}
}
