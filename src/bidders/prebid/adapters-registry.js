import { Aol } from './adapters/aol';
import { Appnexus } from './adapters/appnexus';
import { AppnexusAst } from './adapters/appnexus-ast';
import { AppnexusWebads } from './adapters/appnexus-webads';
import { AudienceNetwork } from './adapters/audience-network';
import { Beachfront } from './adapters/beachfront';
import { IndexExchange } from './adapters/index-exchange';
import { Onemobile } from './adapters/onemobile';
import { Openx } from './adapters/openx';
import { Pubmatic } from './adapters/pubmatic';
import { Rubicon } from './adapters/rubicon';
import { RubiconDisplay } from './adapters/rubicon-display';
import { Wikia } from './adapters/wikia';
import { WikiaVideo } from './adapters/wikia-video';

let adapters = [];
let customAdapters = [];

function registerAliases() {
	adapters
		.filter(adapter => adapter.aliases)
		.forEach((adapter) => {
			window.pbjs.que.push(() => {
				const aliasMap = adapter.aliases;

				Object.keys(aliasMap)
					.forEach((bidderName) => {
						aliasMap[bidderName].forEach((alias) => {
							window.pbjs.aliasBidder(bidderName, alias);
						});
					});
			});
		});
}

function setupAdapters(bidders) {
	adapters = [
		new Aol(bidders.aol),
		new Appnexus(bidders.appnexus),
		new AppnexusAst(bidders.appnexusAst),
		new AppnexusWebads(bidders.appnexusWebads),
		new AudienceNetwork(bidders.audienceNetwork),
		new Beachfront(bidders.beachfront),
		new IndexExchange(bidders.indexExchange),
		new Onemobile(bidders.onemobile),
		new Openx(bidders.openx),
		new Pubmatic(bidders.pubmatic),
		new Rubicon(bidders.rubicon),
		new RubiconDisplay(bidders.rubiconDisplay)
	];
	customAdapters = [
		new Wikia(bidders.wikia),
		new WikiaVideo(bidders.wikiaVideo)
	];

	setupCustomAdapters();
}

function setupCustomAdapters() {
	customAdapters.forEach((adapter) => {
		adapters.push(adapter);

		window.pbjs.que.push(() => {
			window.pbjs.registerBidAdapter(adapter.create, adapter.bidderName);
		});
	});
}

export function getPriorities() {
	const priorities = {};

	adapters.forEach((adapter) => {
		priorities[adapter.bidderName] = adapter.priority || 1;
	});

	return priorities;
}

export function getAdapters(config) {
	if (adapters.length === 0 && config) {
		setupAdapters(config);
		registerAliases();
	}

	return adapters;
}
