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
		doubleVerify: {
			slots: ['top_leaderboard', 'top_boxad', 'incontent_boxad', 'bottom_leaderboard', 'featured'],
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
	preload: {
		gpt: true,
		audigent: true,
		prebid: false,
		apstag: false,
		intentIq: false,
	},
};
