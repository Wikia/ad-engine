export const basicContext = {
	adUnitId:
		`/{custom.dfpId}/wka1b.{slotConfig.group}/{slotConfig.slotName}` +
		'/{state.deviceType}/fc-{custom.adLayout}/_fandom-all',
	custom: {
		dfpId: '5441',
		adLayout: 'home',
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
	},
	templates: {
		ignoreNavbarHeight: true,
	},
	services: {
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['top_leaderboard', 'top_boxad', 'floor_adhesion'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'f2',
			fallback: 'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_f2.json',
		},
		nielsen: {
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
			customSection: 'fan_central',
		},
	},
	slotGroups: {
		VIDEO: ['UAP_BFAA'],
	},
	src: ['fc'],
	vast: {
		adUnitId:
			`/{custom.dfpId}/wka1b.{slotConfig.group}/{slotConfig.slotName}` +
			'{slotConfig.slotNameSuffix}/{state.deviceType}/fc-{custom.adLayout}/_fandom-all',
	},
};
