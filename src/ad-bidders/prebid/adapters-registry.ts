import { Aliases, context, pbjsFactory } from '@ad-engine/core';
import { hasCorrectBidGroup } from '../bidder-helper';
import {
	Appnexus,
	AppnexusAst,
	Criteo,
	Gumgum,
	IndexExchange,
	Kargo,
	MagniteS2s,
	Medianet,
	Nobid,
	Ogury,
	Openx,
	Ozone,
	Pubmatic,
	Roundel,
	Rubicon,
	RubiconDisplay,
	Seedtag,
	TestBidder,
	Triplelift,
	Verizon,
	WebAds,
	Wikia,
	WikiaVideo,
	YahooSsp,
} from './adapters';
import { PrebidAdapter } from './prebid-adapter';
import { isPrebidAdapterConfig, isSlotApplicable } from './prebid-helper';
import { PrebidConfig } from './prebid-models';

class AdaptersRegistry {
	private adapters = new Map<string, PrebidAdapter>();
	private availableAdapters = [
		Appnexus,
		AppnexusAst,
		Criteo,
		Gumgum,
		IndexExchange,
		Kargo,
		MagniteS2s,
		Medianet,
		Nobid,
		Ogury,
		Openx,
		Ozone,
		Pubmatic,
		Roundel,
		Rubicon,
		RubiconDisplay,
		Seedtag,
		TestBidder,
		Triplelift,
		Verizon,
		WebAds,
		Wikia,
		WikiaVideo,
		YahooSsp,
	];

	getAdapter(bidderName: string): PrebidAdapter | undefined {
		return this.getAdapters().get(bidderName);
	}

	getAdapters(): Map<string, PrebidAdapter> {
		if (!this.adapters.size) {
			const biddersConfig: PrebidConfig = context.get('bidders.prebid');

			this.availableAdapters.forEach((AdapterType) => {
				const adapterConfig = biddersConfig[AdapterType.bidderName];

				if (isPrebidAdapterConfig(adapterConfig)) {
					this.adapters.set(AdapterType.bidderName, new AdapterType(adapterConfig));
				}
			});
		}

		return this.adapters;
	}

	configureAdapters(): void {
		this.getAdapters().forEach((adapter) => {
			const aliasMap = adapter.aliases;

			if (aliasMap) {
				this.configureAliases(aliasMap);
			}

			if (adapter.isCustomBidAdapter) {
				this.configureCustomAdapter(adapter.bidderName, adapter);
			}
		});
	}

	setupAdUnits(bidGroup: string): PrebidAdUnit[] {
		const adUnits: PrebidAdUnit[] = [];
		adaptersRegistry.getAdapters().forEach((adapter) => {
			if (adapter && adapter.enabled) {
				const adapterAdUnits = adapter.prepareAdUnits();

				adapterAdUnits.forEach((adUnit) => {
					if (
						adUnit &&
						isSlotApplicable(adUnit.code) &&
						hasCorrectBidGroup(adUnit.code, bidGroup)
					) {
						adUnits.push(adUnit);
					}
				});
			}
		});

		if (bidGroup && bidGroup !== 'not-defined') {
			const slotRefresherConfig = context.get('slotConfig.slotRefresher');
			const availableSlots = Object.keys(slotRefresherConfig.sizes);
			const biddersConfig: PrebidConfig = context.get('bidders.prebid');

			if (!availableSlots.includes(bidGroup)) return;

			this.availableAdapters.forEach((AdapterType) => {
				const adapterConfig = biddersConfig[AdapterType.bidderName];
				if (!adapterConfig || !adapterConfig.enabled) return;

				availableSlots.forEach((slot) => {
					const adUnitSizeLimit = slotRefresherConfig.sizes[slot];
					const slotConfig = adapterConfig.slots[slot];

					if (slotConfig) {
						slotConfig.sizes = slotConfig.sizes.filter(
							(size: [number, number]) => size[1] <= adUnitSizeLimit[1],
						);
					}
				});

				if (isPrebidAdapterConfig(adapterConfig)) {
					this.adapters.set(AdapterType.bidderName, new AdapterType(adapterConfig));
				}
			});

			adUnits.forEach((adUnit) => {
				const adUnitSizeLimit = slotRefresherConfig.sizes[adUnit.code];
				if (!adUnitSizeLimit || !availableSlots.includes(adUnit.code)) return;

				adUnit.mediaTypes.banner.sizes = adUnit.mediaTypes.banner.sizes.filter(
					(size) => size[1] <= adUnitSizeLimit[1],
				);

				adUnit.bids = adUnit.bids.filter((bid) => {
					const size = bid.params?.size;
					return !size || size[1] <= adUnitSizeLimit[1];
				});
			});
		}

		return adUnits;
	}

	private async configureAliases(aliasMap: Aliases): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		Object.keys(aliasMap).forEach((bidderName) =>
			aliasMap[bidderName].forEach((alias) => pbjs.aliasBidder(bidderName, alias)),
		);
	}

	private async configureCustomAdapter(bidderName: string, instance: PrebidAdapter): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		return pbjs.registerBidAdapter(() => instance, bidderName);
	}
}

export const adaptersRegistry = new AdaptersRegistry();
