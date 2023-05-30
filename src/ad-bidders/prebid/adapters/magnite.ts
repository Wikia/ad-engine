import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Magnite extends PrebidAdapter {
	static bidderName = 'mgnipbs';

	get bidderName(): string {
		return Magnite.bidderName;
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
				},
			],
		};
	}
}
