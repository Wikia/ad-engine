import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Vmg extends PrebidAdapter {
	static bidderName = 'vmg';

	get bidderName(): string {
		return Vmg.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
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
					params: {},
				},
			],
		};
	}
}
