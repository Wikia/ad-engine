import { Aliases, context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapterConfig, PrebidAdSlotConfig, PrebidVideoPlacements } from './prebid-models';

export abstract class PrebidAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;

	enabled: boolean;
	slots: any;
	pageTargeting: Dictionary;

	constructor({ enabled, slots }: PrebidAdapterConfig) {
		this.enabled = enabled;
		this.slots = slots;
		this.pageTargeting = {
			...(targetingService.dump() || {}),
		};

		Object.keys(this.pageTargeting).forEach((key) => {
			if (!Array.isArray(this.pageTargeting[key])) {
				this.pageTargeting[key] = [this.pageTargeting[key]];
			}
		});
	}

	abstract prepareConfigForAdUnit(code: string, config: PrebidAdSlotConfig): PrebidAdUnit;

	abstract get bidderName(): string;

	private defaultAdUnitConfig(slotName: string) {
		return this.prepareConfigForAdUnit(slotName, this.slots[slotName]);
	}

	private adUnitConfigWithForcedPlacementForVideo(slotName: string) {
		const adUnitConfig = this.prepareConfigForAdUnit(slotName, this.slots[slotName]);

		if (adUnitConfig.mediaTypes?.video) {
			adUnitConfig.mediaTypes.video.placement = PrebidVideoPlacements.IN_ARTICLE;
		}

		return adUnitConfig;
	}

	prepareAdUnits(): PrebidAdUnit[] {
		const forcedPlacementForVideoEnabled = context.get('bidders.prebid.forceVideoPlacement3');
		const callback = forcedPlacementForVideoEnabled
			? this.adUnitConfigWithForcedPlacementForVideo
			: this.defaultAdUnitConfig;
		return Object.keys(this.slots).map(callback.bind(this));
	}

	protected getTargeting(placementName: string, customTargeting = {}): Dictionary {
		return {
			...this.pageTargeting,
			src: context.get('src') || [''],
			pos: [placementName],
			...customTargeting,
		};
	}
}
