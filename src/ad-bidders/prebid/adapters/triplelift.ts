import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { PrebidNativeProvider } from '../native';

export class Triplelift extends PrebidAdapter {
	static bidderName = 'triplelift';
	static nativeBidderName = 'triplelift_native';

	constructor(options) {
		super(options);
	}

	get bidderName(): string {
		return Triplelift.bidderName;
	}

	isNativeModeOn(): boolean {
		return context.get('bidders.prebid.tripleliftNative.enabled');
	}

	prepareConfigForAdUnit(
		code: string,
		{ sizes, inventoryCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			const prebidNativeProvider = new PrebidNativeProvider();
			if (prebidNativeProvider.isEnabled() && this.isNativeModeOn()) {
				const nativeMediaTypes = prebidNativeProvider.getPrebidNativeConfigMediaTypes();
				return this.prepareNativeConfig(nativeMediaTypes, code, { inventoryCodes });
			}
		}

		return this.prepareStandardConfig(code, { sizes, inventoryCodes });
	}

	prepareStandardConfig(code: string, { sizes, inventoryCodes }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: inventoryCodes.map((inventoryCode) => ({
				bidder: this.bidderName,
				params: {
					inventoryCode,
				},
			})),
		};
	}

	prepareNativeConfig(
		nativeMediaTypes: PrebidNativeMediaType,
		code,
		{ inventoryCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				native: nativeMediaTypes,
			},
			bids: inventoryCodes.map((inventoryCode) => ({
				bidder: Triplelift.nativeBidderName,
				params: {
					inventoryCode,
				},
			})),
		};
	}
}
