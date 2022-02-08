import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Kargo extends PrebidAdapter {
	static bidderName = 'kargo';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Kargo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId }: PrebidAdSlotConfig): PrebidAdUnit {
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
