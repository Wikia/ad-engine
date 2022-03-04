import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}' +
		'/{custom.serverPrefix}.{slotConfig.group}' +
		'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
		'/{state.deviceType}' +
		'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
		'/{custom.wikiIdentifier}-{targeting.s0}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			videoEnabled: false,
			amazonId: '3115',
			bidsRefreshing: {
				slots: ['featured', 'incontent_boxad_1'],
			},
		},
		prebid: {
			enabled: false,
			lazyLoadingEnabled: false,
			bidsRefreshing: {
				slots: ['incontent_boxad_1'],
			},
		},
	},
	custom: {
		dbNameForAdUnit: '_not_a_top1k_wiki',
		dfpId: '5441',
		serverPrefix: 'wka1b',
		wikiIdentifier: '_not_a_top1k_wiki',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
			nativoThreshold: 200,
		},
	},
	slots: {},
	vast: {
		adUnitId:
			'/{custom.dfpId}' +
			'/{custom.serverPrefix}.{slotConfig.group}' +
			'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
			'/{state.deviceType}' +
			'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
			'/{custom.wikiIdentifier}-{targeting.s0}',
		adUnitIdWithDbName:
			'/{custom.dfpId}' +
			'/{custom.serverPrefix}.{slotConfig.group}' +
			'/{slotConfig.adProduct}{slotConfig.slotNameSuffix}' +
			'/{state.deviceType}' +
			'/{targeting.skin}-{targeting.original_host}-{targeting.s2}' +
			'/{custom.dbNameForAdUnit}-{targeting.s0}',
	},
	targeting: {
		rollout_tracking: [],
		skin: 'ucp_desktop',
		uap: 'none',
		uap_c: 'none',
	},
	templates: {
		ignoreNavbarHeight: true,
		safeFanTakeoverElement: {
			boxadSlotNames: ['top_boxad', 'incontent_boxad_1'],
			boxadSize: [300, 601],
		},
	},
	services: {
		adMarketplace: {
			enabled: false,
			insertMethod: 'after',
			insertSelector: '.search-modal__content > form',
		},
		anyclip: {
			enabled: false,
			pubname: 'fandomcom',
			widgetname: '001w000001Y8ud2_19593',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		connatix: {
			enabled: false,
			cid: '016551d5-7095-47c0-a46b-fd0cb9bf4c72',
			playerId: '039a9ead-fb3b-4afc-bcfb-ed241bbaa8d1',
			renderId: 'da3ec3e41d7e41209e5963444de28591',
		},
		durationMedia: {
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
		},
		distroScale: {
			enabled: false,
			id: '22599',
		},
		exCo: {
			enabled: false,
			id: 'f6c04939-d96e-4bc6-850e-d0e6e6cf9701',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: [
				'top_leaderboard',
				'top_boxad',
				'incontent_boxad_1',
				'bottom_leaderboard',
				'featured',
				'incontent_player',
			],
		},
		externalLogger: {
			endpoint: '/wikia.php?controller=AdEngine&method=postLog',
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=fandomdesktop',
			fallback: fallbackInstantConfig,
		},
		nielsen: {
			enabled: false,
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
	},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['gpt'],
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		loadTimeTracking: {
			enabled: true,
			timing: ['responseEnd', 'domContentLoadedEventStart'],
			custom: ['aeConfigured', 'aeStackStart'],
		},
		video: {
			moatTracking: {
				articleVideosPartnerCode: 'wikiajwint101173217941',
				enabled: false,
				jwplayerPluginUrl: 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js',
				partnerCode: 'wikiaimajsint377461931603',
				sampling: 0,
			},
			iasTracking: {
				enabled: false,
				config: {
					anId: '930616',
					campId: '640x480',
				},
			},
		},
		wad: {
			enabled: false,
			blocking: false,
			btRec: {
				enabled: false,
			},
		},
	},
};
