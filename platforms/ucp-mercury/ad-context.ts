import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
		wikiIdentifier: '_not_a_top1k_wiki',
		wikiDBNameIdentifier: '_not_a_top1k_wiki',
		appnexusDfp: true,
		beachfrontDfp: true,
		rubiconDfp: true,
		pubmaticDfp: false,
		serverPrefix: 'wka1b',
		rolloutTracking: 'ucp',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
		pushAfterRendered: {
			top_boxad: ['incontent_boxad_1', 'incontent_player'],
		},
	},
	slots: {},
	vast: {
		adUnitId:
			'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/' +
			'{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
		dbNameAdUnitId:
			'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/' +
			'{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiDBNameIdentifier}-{targeting.s0}',
	},
	targeting: {
		rollout_tracking: 'ucp',
		skin: 'mercury',
		uap: 'none',
		uap_c: 'none',
	},
	services: {
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
			siteId: '1167',
		},
		externalLogger: {
			endpoint: '/wikia.php?controller=AdEngine&method=postLog',
		},
		instantConfig: {
			endpoint: 'https://services.wikia.com/icbm/api/config?app=mobile-wiki',
			fallback: fallbackInstantConfig,
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['top_leaderboard', 'top_boxad', 'incontent_boxad_1', 'bottom_leaderboard'],
		},
		nielsen: {
			enabled: false,
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
	},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: 'mobile',
	state: {
		adStack: [],
		isMobile: true,
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
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
			ignoredSlots: ['featured', 'incontent_player', 'video'],
		},
	},
};
