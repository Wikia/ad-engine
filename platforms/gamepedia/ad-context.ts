export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/gamepedia/{slotConfig.group}/{state.deviceType}/' +
		'{targeting.skin}-{targeting.s2}/_gp_wiki-gamepedia',
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
			endpoint: 'https://services.wikia.com/icbm/api/config?app=gamepedia',
			fallbackConfigKey: 'fallbackInstantConfig',
		},
	},
	src: 'gamepedia',
	state: {
		adStack: [],
		isMobile: false,
	},
	targeting: {
		ae3: '1',
		outstream: 'none',
		skin: 'gamepedia',
		uap: 'none',
		uap_c: 'none',
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/gamepedia/{slotConfig.group}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_gp_wiki-gamepedia',
	},
	templates: {},
};
