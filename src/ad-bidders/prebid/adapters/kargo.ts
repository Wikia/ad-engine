import { AdUnitConfig, BaseAdapter } from './base-adapter';

export class Kargo extends BaseAdapter {
	static bidderName = 'kargo';

	get bidderName(): string {
		return Kargo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId }): AdUnitConfig {
		return {
			code,
			sizes,
			bids: [
				{
					bidder: this.bidderName,
					params: {
						placementId,
					},
				},
			],
		};
	}
}
