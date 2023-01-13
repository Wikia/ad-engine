export const basicContext = {
	adUnitId:
		'/{custom.dfpId}/{custom.serverPrefix}.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
		serverPrefix: 'wka1b',
		wikiIdentifier: '',
	},
	slots: {},
	src: ['bingebot'],
	wiki: {},
	services: {
		instantConfig: {
			endpoint: 'https://services.fandom.com',
			appName: 'bingebot',
			fallback:
				'https://script.wikia.nocookie.net/fandom-ae-assets/icbm/prod/icbm_state_bingebot.json',
		},
	},
};
