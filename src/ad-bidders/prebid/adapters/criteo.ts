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
		return this.getStandardConfig(code, sizes);
	}

	getStandardConfig(code, sizes): PrebidAdUnit {
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
						networkId: this.networkId,
					},
				},
			],
		};
	}
}
