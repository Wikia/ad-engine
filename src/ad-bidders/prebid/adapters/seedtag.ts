import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Seedtag extends PrebidAdapter {
	static bidderName = 'seedtag';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Seedtag.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, publisherId, adUnitId, placement, customCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit | PrebidAdUnit[] {
		if (Array.isArray(adUnitId)) {
			return adUnitId.map((id, idx) => ({
				code: customCodes && Array.isArray(customCodes) ? customCodes[idx] : code,
				forcePush: customCodes && Array.isArray(customCodes),
				mediaTypes: {
					banner: {
						sizes: [sizes[idx]],
					},
				},
				bids: [
					{
						bidder: this.bidderName,
						params: {
							publisherId,
							adUnitId: id,
							placement: placement ?? 'inBanner',
						},
					},
				],
			}));
		} else {
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
}
