import { context, PrebidWrapper } from '@ad-engine/core';
import {
	Aliases,
	Aol,
	Appnexus,
	AppnexusAst,
	BaseAdapter,
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

class AdaptersRegistry {
	private pbjs = PrebidWrapper.make();
	private adapters = new Map<string, BaseAdapter>();
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

	getAdapter(bidderName: string): BaseAdapter | undefined {
		return this.getAdapters().get(bidderName);
	}

	getAdapters(): Map<string, BaseAdapter> {
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
		await Promise.all(
			Object.keys(aliasMap).map((bidderName) =>
				Promise.all(aliasMap[bidderName].map((alias) => this.pbjs.aliasBidder(bidderName, alias))),
			),
		);
	}

	private configureCustomAdapter(bidderName: string, instance: BaseAdapter): Promise<void> {
		return this.pbjs.registerBidAdapter(() => instance, bidderName);
	}
}

export const adaptersRegistry = new AdaptersRegistry();
