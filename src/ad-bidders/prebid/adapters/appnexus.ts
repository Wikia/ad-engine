import { context, Dictionary } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { PrebidNativeProvider } from '../native';

export class Appnexus extends PrebidAdapter {
	static bidderName = 'appnexus';
	placements: Dictionary<string>;

	constructor(options) {
		super(options);

		this.placements = options.placements;
	}

	get bidderName(): string {
		return Appnexus.bidderName;
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, placementId, position = 'mobile' }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			return this.prepareNativeConfig(code, { sizes, placementId, position });
		}

		return this.prepareStandardConfig(code, { sizes, placementId, position });
	}

	prepareStandardConfig(code, { sizes, placementId, position }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			bids: this.getBids(code, { sizes, placementId, position }),
		};
	}

	prepareNativeConfig(code, { sizes, placementId, position }: PrebidAdSlotConfig): PrebidAdUnit {
		const prebidNativeProvider = new PrebidNativeProvider();

		return {
			code,
			mediaTypes: {
				native: {
					sendTargetingKeys: false,
					adTemplate: prebidNativeProvider.getPrebidNativeTemplate(),
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
			bids: this.getBids(code, { sizes, placementId, position }),
		};
	}

	getBids(code, { placementId, position = 'mobile' }: PrebidAdSlotConfig): PrebidBid[] {
		return [
			{
				bidder: this.bidderName,
				params: {
					placementId: placementId || this.getPlacement(position),
					keywords: {
						...this.getTargeting(code),
					},
				},
			},
		];
	}

	getPlacement(position): string {
		let placement = position;

		if (position === 'mobile') {
			const vertical = context.get('targeting.mappedVerticalName');

			placement = vertical && this.placements[vertical] ? vertical : 'other';
		}

		return this.placements[placement];
	}
}
