import { PrebidAdapter, PrebidAdSlotConfig } from '../prebid-adapter';

export class Gumgum extends PrebidAdapter {
	static bidderName = 'gumgum';

	get bidderName(): string {
		return Gumgum.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, inScreen }: PrebidAdSlotConfig): PrebidAdUnit {
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
