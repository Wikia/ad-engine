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
			endpoint: 'https://services.fandom.com',
			appName: 'bingebot',
			fallback: 'https://fandom-ae-assets.s3.amazonaws.com/icbm/icbm_state_prod_bingebot.json',
		},
	},
};
