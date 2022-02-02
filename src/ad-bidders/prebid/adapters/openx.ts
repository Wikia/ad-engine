import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Openx extends PrebidAdapter {
	static bidderName = 'openx';
	delDomain: string;

	constructor(options) {
		super(options);

		this.delDomain = options.delDomain;
	}

	get bidderName(): string {
		return Openx.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, unit }: PrebidAdSlotConfig): PrebidAdUnit {
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
						unit,
						delDomain: this.delDomain,
					},
				},
			],
		};
	}
}
