import fallbackInstantConfig from './fallback-config.json';

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
	services: {
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['top_leaderboard', 'top_boxad', 'incontent_boxad', 'bottom_leaderboard', 'featured'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=f2',
			fallback: fallbackInstantConfig,
		},
		moatYi: {
			partnerCode: 'wikiaprebidheader490634422386',
		},
		nielsen: {
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
	},
	slotGroups: {
		VIDEO: ['FEATURED', 'UAP_BFAA', 'UAP_BFAB', 'ABCD', 'VIDEO'],
	},
	src: 'ns',
	vast: {
		adUnitId:
			`/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.slotName}` +
			'{slotConfig.slotNameSuffix}/{state.deviceType}/ns-{custom.adLayout}/_fandom-all',
	},
};
