import { AdUnitConfig, BaseAdapter, BidderAdSlotConfig } from './base-adapter';

export class Vmg extends BaseAdapter {
	static bidderName = 'vmg';

	get bidderName(): string {
		return Vmg.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes }: BidderAdSlotConfig): AdUnitConfig {
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
				},
			],
		};
	}
}
