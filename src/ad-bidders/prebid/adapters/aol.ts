import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Aol extends PrebidAdapter {
	static bidderName = 'aol';
	network: string;

	get bidderName(): string {
		return Aol.bidderName;
	}

	constructor(options) {
		super(options);

		this.network = options.network;
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, placement, alias, sizeId }: PrebidAdSlotConfig,
	): PrebidAdUnit {
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
						alias,
						placement,
						sizeId,
						network: this.network,
					},
				},
			],
		};
	}
}
