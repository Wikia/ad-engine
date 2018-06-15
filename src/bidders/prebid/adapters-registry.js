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

const adapters = [];
const customAdapters = [];
const availableAdapters = {
	aol: Aol,
	appnexus: Appnexus,
	appnexusAst: AppnexusAst,
	appnexusWebads: AppnexusWebads,
	audienceNetwork: AudienceNetwork,
	beachfront: Beachfront,
	indexExchange: IndexExchange,
	onemobile: Onemobile,
	openx: Openx,
	pubmatic: Pubmatic,
	rubicon: Rubicon,
	rubiconDisplay: RubiconDisplay
};

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
	Object
		.keys(availableAdapters)
		.forEach((key) => {
			if (bidders[key]) {
				const adapter = new availableAdapters[key](bidders[key]);

				adapters.push(adapter);
			}
		});

	setupCustomAdapters(bidders);
}

function setupCustomAdapters(bidders) {
	if (bidders.wikia) {
		customAdapters.push(new Wikia(bidders.wikia));
	}

	if (bidders.wikiaVideo) {
		customAdapters.push(new WikiaVideo(bidders.wikiaVideo));
	}

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
