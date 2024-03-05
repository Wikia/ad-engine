import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Ogury extends PrebidAdapter {
	static bidderName = 'ogury';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Ogury.bidderName;
	}

	prepareConfigForAdUnit(code, { adUnitId, assetKey, sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		const newSizes = this.filterSizesForRefreshing(code, sizes);

		return {
			code,
			mediaTypes: {
				banner: {
					sizes: newSizes,
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						assetKey,
						adUnitId,
						skipSizeCheck: true,
					},
				},
			],
		};
	}
}
