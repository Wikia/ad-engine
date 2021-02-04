import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Onemobile extends PrebidAdapter {
	static bidderName = 'onemobile';
	siteId: string;

	get bidderName(): string {
		return Onemobile.bidderName;
	}

	constructor(options) {
		super(options);

		this.siteId = options.siteId;
	}

	prepareConfigForAdUnit(code, { size, pos }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes: [size],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						pos,
						dcn: this.siteId,
					},
				},
			],
		};
	}
}
