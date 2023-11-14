import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Gumgum extends PrebidAdapter {
	static bidderName = 'gumgum';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Gumgum.bidderName;
	}

	prepareConfigForAdUnit(code: string, { sizes, inScreen }: PrebidAdSlotConfig): PrebidAdUnit {
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
						inScreen,
					},
				},
			],
		};
	}
}
