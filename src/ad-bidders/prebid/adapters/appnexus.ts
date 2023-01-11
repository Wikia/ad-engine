import { context, Dictionary } from '@ad-engine/core';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';
import { PrebidNativeProvider, PrebidNativeConfig } from '../native';

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

	isNativeModeOn(): boolean {
		return context.get('bidders.prebid.appnexusNative.enabled');
	}

	prepareConfigForAdUnit(
		code,
		{ sizes, placementId, position = 'mobile' }: PrebidAdSlotConfig,
	): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			const prebidNativeProvider = new PrebidNativeProvider();
			if (
				prebidNativeProvider.isEnabled('bidders.prebid.native.enabled', false) &&
				this.isNativeModeOn()
			) {
				return this.prepareNativeConfig(code, { sizes, placementId, position });
			}
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
		return {
			code,
			mediaTypes: {
				native: PrebidNativeConfig.getPrebidNativeMediaTypes(position),
			},
			bids: this.getBids(code, { sizes, placementId, position }),
		};
	}

	getBids(code, { placementId, position = 'mobile' }: PrebidAdSlotConfig): PrebidBid[] {
		if (Array.isArray(placementId) && placementId.length > 0) {
			return placementId.map((id) => ({
				bidder: this.bidderName,
				params: {
					placementId: id,
					keywords: {
						...this.getTargeting(code),
					},
				},
			}));
		}

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
