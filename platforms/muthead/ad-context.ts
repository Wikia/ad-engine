import fallbackInstantConfig from './fallback-config.json';

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
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		maxDelayTimeout: 2000,
		wad: {
			enabled: false,
			blocking: false,
			btRec: {
				enabled: false,
			},
		},
	},
	slots: {},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	services: {
		durationMedia: {
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10655/dm.js',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=muthead',
			fallback: fallbackInstantConfig,
		},
	},
	src: 'sports',
	state: {
		adStack: [],
		isMobile: false,
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/cports/{slotConfig.adProduct}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_{targeting.s1}-{targeting.s0}',
	},
	templates: {},
};
