import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class RubiconPG extends PrebidAdapter {
	static bidderName = 'rubicon_pg';
	accountId: number;

	constructor(options) {
		super(options);

		this.accountId = options.accountId;
	}

	get bidderName(): string {
		return RubiconPG.bidderName;
	}

	prepareConfigForAdUnit(code, { siteId, zoneId, sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: [
				{
					bidder: 'pgRubicon',
					params: {
						siteId,
						zoneId,
						accountId: this.accountId,
						pgdealsonly: true,
					},
				},
			],
		};
	}
}
