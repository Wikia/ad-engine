export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/sports/{slotConfig.group}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			dealsEnabled: false,
			videoEnabled: false,
			amazonId: '3115',
		},
		prebid: {
			enabled: false,
			libraryUrl:
				'https://slot1.fandom.com/__am/155542168020822/one/minify%3D1/extensions/wikia/AdEngine3/dist/vendors/prebid.js',
			lazyLoadingEnabled: false,
			bidsRefreshing: {
				enabled: false,
				slots: [],
			},
		},
	},
	custom: {
		dfpId: '5441',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
	},
	listeners: {
		porvata: [],
		slot: [],
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
	},
	slots: {},
	services: {
		instantConfig: {
			endpoint: 'https://services.wikia.com/icbm/api/config?app=sports',
			fallbackConfigKey: 'fallbackInstantConfig',
		},
	},
	src: 'sports',
	state: {
		adStack: [],
		isMobile: false,
	},
	targeting: {
		uap: 'none',
		uap_c: 'none',
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/sports/{slotConfig.group}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/{targeting.s1}-{targeting.s0}',
	},
	templates: {},
};
