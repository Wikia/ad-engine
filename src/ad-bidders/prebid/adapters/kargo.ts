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
			bids: this.getBids(placementId),
		};
	}

	getBids(placementId) {
		if (Array.isArray(placementId) && placementId.length > 0) {
			return placementId.map((id) => ({
				bidder: this.bidderName,
				params: {
					placementId: id,
				},
			}));
		}

		return [
			{
				bidder: this.bidderName,
				params: {
					placementId,
				},
			},
		];
	}
}
g;
