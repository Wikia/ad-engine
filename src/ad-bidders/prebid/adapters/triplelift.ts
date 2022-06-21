import { context } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { PrebidNativeProvider } from '../native';

export class Triplelift extends PrebidAdapter {
	static bidderName = 'triplelift';

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
				const template = prebidNativeProvider.getPrebidNativeTemplate();
				return this.prepareNativeConfig(template, code, { inventoryCodes });
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
		template: string,
		code,
		{ inventoryCodes }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				native: {
					sendTargetingKeys: false,
					adTemplate: template,
					title: {
						required: true,
					},
					body: {
						required: true,
					},
					clickUrl: {
						required: true,
					},
					icon: {
						required: true,
						aspect_ratios: [
							{
								min_width: 100,
								min_height: 100,
								ratio_width: 1,
								ratio_height: 1,
							},
						],
					},
				},
			},
			bids: [
				{
					bidder: this.bidderName,
					params: {
						inventoryCodes,
					},
				},
			],
		};
	}
}
