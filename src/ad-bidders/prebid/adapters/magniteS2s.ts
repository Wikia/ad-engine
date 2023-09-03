import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class MagniteS2s extends PrebidAdapter {
	static bidderName = 'mgnipbs';
	accountId: number;

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
	}

	get bidderName(): string {
		return MagniteS2s.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
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
					params: {}, // Magnite requires empty "params"
				},
			],
		};
	}
}
