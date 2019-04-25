import { context } from '@wikia/ad-engine';
import {
	Aliases,
	Aol,
	Appnexus,
	AppnexusAst,
	AudienceNetwork,
	BaseAdapter,
	Beachfront,
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
	private adapters = new Map<string, BaseAdapter>();
	private availableAdapters = [
		Aol,
		Appnexus,
		AppnexusAst,
		AudienceNetwork,
		Beachfront,
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

	private configureAliases(aliasMap: Aliases): void {
		window.pbjs.que.push(() => {
			Object.keys(aliasMap).forEach((bidderName) => {
				aliasMap[bidderName].forEach((alias) => {
					window.pbjs.aliasBidder(bidderName, alias);
				});
			});
		});
	}

	private configureCustomAdapter(bidderName: string, instance): void {
		window.pbjs.que.push(() => {
			window.pbjs.registerBidAdapter(instance.create, bidderName);
		});
	}
}

export const adaptersRegistry = new AdaptersRegistry();
