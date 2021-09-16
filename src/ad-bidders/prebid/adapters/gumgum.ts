import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Gumgum extends PrebidAdapter {
	static bidderName = 'gumgum';

	get bidderName(): string {
		return Gumgum.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, zone }: PrebidAdSlotConfig): PrebidAdUnit {
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
						zone,
					},
				},
			],
		};
	}
}
