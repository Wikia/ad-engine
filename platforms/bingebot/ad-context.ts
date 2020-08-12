import fallbackInstantConfig from './fallback-config.json';

export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
		serverPrefix: 'wka1b',
		wikiIdentifier: '',
	},
	slots: {},
	src: 'bingebot',
	state: {
		adStack: [],
	},
	targeting: {
		skin: 'bingebot',
	},
	services: {
		instantConfig: {
			endpoint: 'https://services.wikia.com/icbm/api/config?app=bingebot',
			fallback: fallbackInstantConfig,
		},
	},
};
