// @ts-strict-ignore
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Criteo extends PrebidAdapter {
	static bidderName = 'criteo';
	networkId: string;

	constructor(options) {
		super(options);

		this.networkId = options.networkId;
	}

	get bidderName(): string {
		return Criteo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		const newSizes = this.filterSizesForRefreshing(code, sizes);
		return this.getStandardConfig(code, newSizes);
	}

	getStandardConfig(code, sizes): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {
						networkId: this.networkId,
					},
				},
			],
		};
	}
}
