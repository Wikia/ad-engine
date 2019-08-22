export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/sports/{slotConfig.group}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/{targeting.s1}-{targeting.s0}',
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
			// TODO: ADEN-9188 app = sports / muthead,futhead
			endpoint: 'https://services.wikia.com/icbm/api/config?app=gamepedia',
			fallbackConfigKey: 'fallbackInstantConfig',
		},
	},
	src: 'sports',
	state: {
		adStack: [],
		isMobile: false,
	},
	targeting: {
		ae3: '1',
		skin: 'turf',
		uap: 'none',
		uap_c: 'none',
		s0: 'gaming',
		s2: 'main',
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/sports/{slotConfig.group}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/{targeting.s1}-{targeting.s0}',
	},
	templates: {},
};
