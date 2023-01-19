export const basicContext = {
	adUnitId:
		`/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.slotName}` +
		'/{state.deviceType}/ns-{custom.adLayout}/_fandom-all',
	custom: {
		dfpId: '5441',
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
		porvata: {
			audio: {
				exposeToSlot: 'true',
				key: 'audio',
				segment: '-audio',
			},
		},
		video: {
			moatTracking: {
				enabled: false,
				jwplayerPluginUrl: 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js',
				partnerCode: 'wikiajwint101173217941',
				sampling: 100,
			},
			iasTracking: {
				enabled: false,
				config: {
					anId: '930616',
					campId: '640x480',
				},
			},
		},
	},
	templates: {
		ignoreNavbarHeight: true,
	},
	services: {
		iasPublisherOptimization: {
			slots: ['top_leaderboard', 'top_boxad', 'incontent_boxad', 'bottom_leaderboard', 'featured'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'f2',
			fallback: 'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_f2.json',
		},
		moatYi: {
			partnerCode: 'wikiaprebidheader490634422386',
		},
		nielsen: {
			customSection: 'news_and_stories',
		},
	},
	slotGroups: {
		VIDEO: ['FEATURED', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	src: ['ns'],
	vast: {
		adUnitId:
			`/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.slotName}` +
			'{slotConfig.slotNameSuffix}/{state.deviceType}/ns-{custom.adLayout}/_fandom-all',
	},
};
