export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/cports/{slotConfig.group}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
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
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
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
			'/{custom.dfpId}/cports/{slotConfig.adProduct}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
	},
	templates: {},
};
