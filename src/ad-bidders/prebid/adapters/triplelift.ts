import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Triplelift extends PrebidAdapter {
	static bidderName = 'triplelift';

	get bidderName(): string {
		return Triplelift.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, inventoryCode }: PrebidAdSlotConfig): PrebidAdUnit {
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
						inventoryCode,
					},
				},
			],
		};
	}
}
