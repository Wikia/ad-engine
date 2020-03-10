import { Aliases, context, pbjsFactory } from '@ad-engine/core';
import {
	Across,
	Aol,
	Appnexus,
	AppnexusAst,
	Beachfront,
	Criteo,
	Gumgum,
	IndexExchange,
	Kargo,
	Lkqd,
	Nobid,
	Onemobile,
	OneVideo,
	Openx,
	Pubmatic,
	Rubicon,
	RubiconDisplay,
	Telaria,
	Triplelift,
	Vmg,
	Wikia,
	WikiaVideo,
} from './adapters';
import { PrebidAdapter } from './prebid-adapter';
import { isPrebidAdapterConfig } from './prebid-helper';
import { PrebidConfig } from './prebid-models';

class AdaptersRegistry {
	private adapters = new Map<string, PrebidAdapter>();
	private availableAdapters = [
		Across,
		Aol,
		Appnexus,
		AppnexusAst,
		Beachfront,
		Criteo,
		Gumgum,
		IndexExchange,
		Kargo,
		Lkqd,
		Nobid,
		Onemobile,
		OneVideo,
		Openx,
		Pubmatic,
		RubiconDisplay,
		Rubicon,
		Telaria,
		Triplelift,
		Vmg,
		Wikia,
		WikiaVideo,
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
