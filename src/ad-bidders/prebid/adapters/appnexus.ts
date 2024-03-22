// @ts-strict-ignore
import { context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidNativeConfig } from '../native';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

export class Appnexus extends PrebidAdapter {
	static bidderName = 'appnexus';
	placements: Dictionary<string>;
	bidderSettings = {
		storageAllowed: true,
	};

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
			const vertical = targetingService.get('mappedVerticalName');

			placement = vertical && this.placements[vertical] ? vertical : 'other';
		}

		return this.placements[placement];
	}
}
