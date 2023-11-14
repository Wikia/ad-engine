import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Kargo extends PrebidAdapter {
	static bidderName = 'kargo';
	bidderSettings = {
		storageAllowed: true,
	};

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
			ortb2Imp: this.getOrtb2Imp(code),
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
