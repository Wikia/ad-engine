import { Aliases, context, Dictionary, targetingService } from '@ad-engine/core';
import { PrebidAdapterConfig, PrebidAdSlotConfig, PrebidVideoPlacements } from './prebid-models';

interface BidderSettings {
	storageAllowed?: boolean | string[];
}

export abstract class PrebidAdapter {
	static bidderName: string;
	aliases?: Aliases;
	isCustomBidAdapter = false;

	enabled: boolean;
	slots: any;
	pageTargeting: Dictionary;
	bidderSettings?: BidderSettings;

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

	private adUnitConfigDefaultFactory(slotName: string) {
		return this.prepareConfigForAdUnit(slotName, this.slots[slotName]);
	}

	private adUnitConfigWithForcedPlacementForVideoFactory(slotName: string) {
		const adUnitConfig = this.prepareConfigForAdUnit(slotName, this.slots[slotName]);

		if (!adUnitConfig) {
			console.warn('Wrong ad unit config for slot: ', slotName, this.bidderName);
		}

		if (adUnitConfig?.mediaTypes?.video) {
			adUnitConfig.mediaTypes.video.placement = PrebidVideoPlacements.IN_ARTICLE;

			adUnitConfig.bids.map(({ params }) => {
				if (params.video?.placement) {
					params.video.placement = PrebidVideoPlacements.IN_ARTICLE;
				}
			});
		}

		return adUnitConfig;
	}

	prepareAdUnits(): PrebidAdUnit[] {
		const forcedPlacementForVideoEnabled = context.get(
			'bidders.prebid.forceInArticleVideoPlacement',
		);
		const factoryCallback = forcedPlacementForVideoEnabled
			? this.adUnitConfigWithForcedPlacementForVideoFactory.bind(this)
			: this.adUnitConfigDefaultFactory.bind(this);

		return Object.keys(this.slots).map(factoryCallback);
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
