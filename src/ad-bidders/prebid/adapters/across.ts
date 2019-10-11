import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Across extends PrebidAdapter {
	static bidderName = '33across';

	get bidderName(): string {
		return Across.bidderName;
	}

	prepareConfigForAdUnit(
		code: string,
		{ sizes, siteId, productId }: PrebidAdSlotConfig,
	): PrebidAdUnit {
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
						siteId,
						productId,
					},
				},
			],
		};
	}
}
