import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Triplelift extends PrebidAdapter {
	static bidderName = 'triplelift';
	bidderSettings = {
		storageAllowed: true,
	};

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Triplelift.bidderName;
	}

	prepareConfigForAdUnit(
		code: string,
		{ sizes, inventoryCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: inventoryCodes.map((inventoryCode) => ({
				bidder: this.bidderName,
				params: {
					inventoryCode,
				},
			})),
			debugInfo: inventoryCodes?.join(';'),
		};
	}
}
