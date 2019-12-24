import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Nobid extends PrebidAdapter {
	static bidderName = 'nobid';

	get bidderName(): string {
		return Nobid.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, siteId }: PrebidAdSlotConfig): PrebidAdUnit {
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
					},
				},
			],
		};
	}
}
