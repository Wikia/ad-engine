import { Prebid } from '@wikia/ad-bidders/prebid';
import { PrebidBid } from '@wikia/ad-engine/models/prebid-models';

export class PrebidBidFactory {
	static readonly fakeBid: PrebidBid = {
		cpm: 0.05,
		status: 'available',
		bidderCode: 'bidderA',
		timeToRespond: 2000,
		getStatusCode: () => Prebid.validResponseStatusCode,
	} as PrebidBid;

	static getBid(bid: Partial<PrebidBid>): PrebidBid {
		return {
			...PrebidBidFactory.fakeBid,
			...bid,
		};
	}
}
