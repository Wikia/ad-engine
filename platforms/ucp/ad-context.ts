import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			dealsEnabled: false,
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
		},
	},
	slots: {},
	vast: {
		adUnitId:
			'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
		adUnitIdWithDbName:
			'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.dbNameForAdUnit}-{targeting.s0}',
	},
	targeting: {
		rollout_tracking: ['ucp'],
		skin: 'oasis',
		uap: 'none',
		uap_c: 'none',
	},
	templates: {
		safeFanTakeoverElement: {
			boxadSlotNames: ['top_boxad', 'incontent_boxad_1'],
			boxadSize: [300, 601],
		},
	},
	services: {
		adMarketplace: {
			enabled: false,
			insertMethod: 'prepend',
			insertSelector: '.wds-global-navigation__search-suggestions.wds-dropdown__content',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
		},
		distroScale: {
			enabled: false,
			id: '22599',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: [
				'hivi_leaderboard',
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
			endpoint: 'https://services.fandom.com/icbm/api/config?app=oasis',
			fallback: fallbackInstantConfig,
		},
		nielsen: {
			enabled: false,
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
		realVu: {
			enabled: false,
			partnerId: 'E6H4',
		},
	},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: 'gpt',
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
		wad: {
			enabled: false,
			blocking: false,
			btRec: {
				enabled: false,
				placementsMap: {
					top_leaderboard: {
						uid: '5b33d3584c-188',
						style: {
							margin: '10px 0',
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					top_boxad: {
						uid: '5b2d1649b2-188',
						style: {
							'margin-bottom': '10px',
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
					incontent_boxad_1: {
						uid: '5bbe13967e-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: true,
					},
					bottom_leaderboard: {
						uid: '5b8f13805d-188',
						style: {
							'margin-bottom': '23px',
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: true,
					},
				},
			},
		},
	},
};
