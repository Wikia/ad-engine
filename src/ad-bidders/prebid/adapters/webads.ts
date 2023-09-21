import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class WebAds extends PrebidAdapter {
	static bidderName = 'relevantdigital';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return WebAds.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ accountId, sizes, placementId }: PrebidAdSlotConfig,
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
						placementId,
						accountId,
						pbsHost: 'webads-pbs.relevant-digital.com',
					},
				},
			],
		};
	}
}
