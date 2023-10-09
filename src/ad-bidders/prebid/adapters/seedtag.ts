import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Seedtag extends PrebidAdapter {
	static bidderName = 'seedtag';

	constructor(options) {
		super(options);
		console.log('>>> seedtag 1');
	}

	get bidderName(): string {
		return Seedtag.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, publisherId, adUnitId, placement }: PrebidAdSlotConfig,
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
						publisherId,
						adUnitId,
						placement: placement ?? 'inBanner',
					},
				},
			],
		};
	}
}
