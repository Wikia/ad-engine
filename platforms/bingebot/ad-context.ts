import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
		serverPrefix: 'wka1b',
		wikiIdentifier: '',
	},
	options: {
		loadTimeTracking: {
			enabled: false,
		},
	},
	slots: {},
	src: ['bingebot'],
	state: {
		adStack: [],
	},
	targeting: {
		skin: 'bingebot',
	},
	wiki: {
		targeting: {
			directedAtChildren: false,
		},
	},
	services: {
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=bingebot',
			fallback: fallbackInstantConfig,
		},
	},
};
