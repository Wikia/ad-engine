import { BaseAdapter, BidderAdSlotConfig } from './base-adapter';

export class Gumgum extends BaseAdapter {
	static bidderName = 'gumgum';

	get bidderName(): string {
		return Gumgum.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, inScreen }: BidderAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						inScreen,
					},
				},
			],
		};
	}
}
