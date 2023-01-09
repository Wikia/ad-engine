import { context, Dictionary, TargetingData, targetingService } from '@ad-engine/core';
import { PrebidNativeConfig } from '../native';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

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
			if (context.get('bidders.prebid.native.enabled') && this.isNativeModeOn()) {
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
			const vertical = targetingService.getAll<TargetingData>().mappedVerticalName;

			placement = vertical && this.placements[vertical] ? vertical : 'other';
		}

		return this.placements[placement];
	}
}
