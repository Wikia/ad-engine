import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class AppnexusGroupM extends PrebidAdapter {
	static bidderName = 'appnexusGroupM';
	aliases = {
		appnexus: [AppnexusGroupM.bidderName],
	};

	get bidderName(): string {
		return AppnexusGroupM.bidderName;
	}

	constructor(options) {
		super(options);
	}

	prepareConfigForAdUnit(code: string, { sizes, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
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
					},
				},
			],
		};
	}
}
