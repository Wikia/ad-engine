// @ts-strict-ignore
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
		const newSizes = this.filterSizesForRefreshing(code, sizes);

		return {
			code,
			mediaTypes: {
				banner: {
					sizes: newSizes,
				},
			},
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
