import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class YahooSsp extends PrebidAdapter {
	static bidderName = 'yahoossp';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return YahooSsp.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, pubId }: PrebidAdSlotConfig): PrebidAdUnit {
		return this.getStandardConfig(code, sizes, pubId);
	}

	getStandardConfig(code, sizes, pubId): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: this.getBids(pubId),
		};
	}

	getBids(pubId): PrebidBid[] {
		return pubId.map((id) => ({
			bidder: this.bidderName,
			params: {
				pubId: id,
			},
		}));
	}
}
