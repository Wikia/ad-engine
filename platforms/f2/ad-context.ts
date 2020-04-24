export const basicContext = {
	adUnitId:
		`/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.slotName}` +
		'/{state.deviceType}/ns-{custom.adLayout}/_fandom-all',
	custom: {
		dfpid: '5441',
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
	},
	options: {
		contentLanguage: 'en',
		porvata: {
			audio: {
				exposeToSlot: 'true',
				key: 'audio',
				segment: '-audio',
			},
		},
		video: {
			moatTracking: {
				enabled: false,
				partnerCode: 'wikiajwint101173217941',
				sampling: 0,
			},
		},
	},
	services: {
		instantConfig: {
			endpoint: 'https://services.wikia.com/icbm/api/config?app=f2',
			fallbackConfigKey: 'fallbackInstantConfig',
		},
		moatYi: {
			partnerCode: 'wikiaprebidheader490634422386',
		},
		nielsen: {
			appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
		},
	},
	slotGroup: {
		VIDEO: ['FEATURED', 'UAP_BFAA', 'UAP_BFAB', 'ABCD', 'VIDEO'],
	},
	src: 'ns',
	vast: {
		adUnitId:
			`/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.slotName}` +
			'{slotConfig.slotNameSuffix}/{state.deviceType}/ns-{custom.adLayout}/_fandom-all',
	},
};
