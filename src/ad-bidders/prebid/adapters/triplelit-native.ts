import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { context } from '@ad-engine/core';
import { PrebidNativeProvider } from '../native';

export class TripleliftNative extends PrebidAdapter {
	static bidderName = 'triplelift_native';

	constructor(options) {
		super(options);
		this.enabled = context.get('bidders.prebid.tripleliftNative.enabled');
	}

	get bidderName(): string {
		return TripleliftNative.bidderName;
	}

	prepareConfigForAdUnit(code: string, { inventoryCodes }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			const prebidNativeProvider = new PrebidNativeProvider();
			if (prebidNativeProvider.isEnabled() && this.enabled) {
				const nativeMediaTypes = prebidNativeProvider.getPrebidNativeConfigMediaTypes();
				return {
					code,
					mediaTypes: {
						native: nativeMediaTypes,
					},
					bids: inventoryCodes.map((inventoryCode) => ({
						bidder: this.bidderName,
						params: {
							inventoryCode,
						},
					})),
				};
			}
		}
	}
}
