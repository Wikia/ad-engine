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
				slots: ['featured', 'mobile_in_content'],
			},
		},
		prebid: {
			enabled: false,
			lazyLoadingEnabled: false,
			bidsRefreshing: {
				slots: ['mobile_in_content'],
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
		},
		pushAfterRendered: {
			top_boxad: ['incontent_player'],
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
		skin: 'ucp_mobile',
		uap: 'none',
		uap_c: 'none',
	},
	templates: {
		safeFanTakeoverElement: {
			boxadSlotNames: ['top_boxad', 'mobile_prefooter'],
			boxadSize: [300, 251],
		},
	},
	services: {
		adMarketplace: {
			enabled: false,
			insertMethod: 'after',
			insertSelector: '.mobile-search-modal__content form',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
		},
		externalLogger: {
			endpoint: '/wikia.php?controller=AdEngine&method=postLog',
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=fandommobile',
			fallback: fallbackInstantConfig,
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
		nielsen: {
			enabled: false,
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
	},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['mobile'],
	state: {
		adStack: [],
		isMobile: true,
	},
	options: {
		connectionTracking: {
			enabled: true,
		},
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		scrollSpeedTracking: {
			enabled: true,
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
		viewabilityCounter: {
			enabled: true,
			ignoredSlots: ['featured', 'incontent_player'],
		},
	},
};
