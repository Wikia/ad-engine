import { PrebidAdapter } from '../prebid-adapter';

export class Kargo extends PrebidAdapter {
	static bidderName = 'kargo';

	get bidderName(): string {
		return Kargo.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes, placementId }): PrebidAdUnit {
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
						placementId,
					},
				},
			],
		};
	}
}
