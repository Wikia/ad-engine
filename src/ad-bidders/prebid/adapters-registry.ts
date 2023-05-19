import { Aliases, context, pbjsFactory } from '@ad-engine/core';
import {
	Appnexus,
	AppnexusAst,
	Criteo,
	Freewheel,
	Gumgum,
	IndexExchange,
	Kargo,
	Medianet,
	Nobid,
	Ogury,
	Pubmatic,
	Roundel,
	Rubicon,
	RubiconDisplay,
	TestBidder,
	Triplelift,
	Verizon,
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
		Freewheel,
		Gumgum,
		IndexExchange,
		Kargo,
		Medianet,
		Nobid,
		Ogury,
		Pubmatic,
		Roundel,
		Rubicon,
		RubiconDisplay,
		TestBidder,
		Triplelift,
		Verizon,
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

	setupAdUnits(): PrebidAdUnit[] {
		let adUnits: PrebidAdUnit[] = [];

		adaptersRegistry.getAdapters().forEach((adapter) => {
			if (adapter && adapter.enabled) {
				const adapterAdUnits = adapter.prepareAdUnits();

				adapterAdUnits.forEach((adUnit) => {
					if (adUnit && isSlotApplicable(adUnit.code)) {
						adUnits.push(adUnit);
					}
				});
			}
		});

		if (context.get('bidders.prebid.filter') === 'static') {
			adUnits = adUnits.filter((a) => document.querySelector(`div[id="${a.code}"]`) !== null);
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
