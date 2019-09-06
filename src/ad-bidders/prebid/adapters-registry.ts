import { Aliases, context, pbjsFactory } from '@ad-engine/core';
import {
	Aol,
	Appnexus,
	AppnexusAst,
	Beachfront,
	Gumgum,
	IndexExchange,
	Kargo,
	Lkqd,
	Onemobile,
	Openx,
	Pubmatic,
	Rubicon,
	RubiconDisplay,
	Vmg,
	Wikia,
	WikiaVideo,
} from './adapters';
import { PrebidAdapter } from './prebid-adapter';

class AdaptersRegistry {
	private adapters = new Map<string, PrebidAdapter>();
	private availableAdapters = [
		Aol,
		Appnexus,
		AppnexusAst,
		Beachfront,
		Gumgum,
		IndexExchange,
		Kargo,
		Lkqd,
		Onemobile,
		Openx,
		Pubmatic,
		RubiconDisplay,
		Rubicon,
		Vmg,
		Wikia,
		WikiaVideo,
	];

	getAdapter(bidderName: string): PrebidAdapter | undefined {
		return this.getAdapters().get(bidderName);
	}

	getAdapters(): Map<string, PrebidAdapter> {
		if (!this.adapters.size) {
			const biddersConfig = context.get('bidders.prebid');

			this.availableAdapters.forEach((adapter) => {
				const adapterConfig = adapter && biddersConfig[adapter.bidderName];

				if (adapterConfig) {
					this.adapters.set(adapter.bidderName, new adapter(adapterConfig));
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
