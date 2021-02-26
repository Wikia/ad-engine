import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/_gp_wiki-gamepedia',
	custom: {
		dfpId: '5441',
		serverPrefix: 'wka1b',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
		wad: {
			enabled: false,
			blocking: false,
			blockingSrc: 'gamepedia-rec',
			btRec: {
				enabled: false,
				placementsMap: {
					top_leaderboard: {
						uid: '5d49e52d0a-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					top_boxad: {
						uid: '5d49e534b1-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
					bottom_leaderboard: {
						uid: '5d49e5469d-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					incontent_boxad_1: {
						uid: '5d49e54f25-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
					footer_boxad: {
						uid: '5d49e53f6b-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
				},
			},
		},
	},
	slots: {},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	targeting: {
		rollout_tracking: ['ucp'],
	},
	services: {
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['top_leaderboard', 'bottom_leaderboard'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=gamepedia',
			fallback: fallbackInstantConfig,
		},
		realVu: {
			id: 'c=E6H4_f=mint',
			enabled: false,
		},
		taxonomy: {
			enabled: false,
		},
	},
	src: 'gamepedia',
	state: {
		adStack: [],
		isMobile: false,
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_gp_wiki-gamepedia',
	},
	templates: {},
};
