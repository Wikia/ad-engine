import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { context } from '@ad-engine/core';
import { PrebidNativeProvider, PrebidNativeConfig } from '../native';

export class TripleliftNative extends PrebidAdapter {
	static bidderName = 'triplelift_native';

	constructor(options) {
		super(options);
		this.enabled = context.get('bidders.prebid.tripleliftNative.enabled');
	}

	get bidderName(): string {
		return TripleliftNative.bidderName;
	}

	isNativeModeOn(): boolean {
		return context.get('bidders.prebid.tripleliftNative.enabled');
	}

	prepareConfigForAdUnit(
		code: string,
		{ inventoryCodes, position }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			const prebidNativeProvider = new PrebidNativeProvider();
			if (prebidNativeProvider.isEnabled() && this.isNativeModeOn()) {
				const nativeMediaTypes = PrebidNativeConfig.getPrebidNativeMediaTypes(position);
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
