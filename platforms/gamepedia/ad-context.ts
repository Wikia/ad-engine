import fallbackInstantConfig from './fallback-config.json';

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
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		disableConsentQueue: true,
		maxDelayTimeout: 2000,
		wad: {
			enabled: false,
			blocking: false,
			blockingSrc: 'gamepedia-rec',
			btRec: {
				enabled: false,
				placementsMap: {
					'cdm-zone-01': {
						uid: '5d49e52d0a-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					'cdm-zone-02': {
						uid: '5d49e534b1-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
					'cdm-zone-03': {
						uid: '5d49e53f6b-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
					'cdm-zone-04': {
						uid: '5d49e5469d-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					'cdm-zone-06': {
						uid: '5d49e54f25-188',
						style: {
							'z-index': '100',
						},
						size: {
							width: 300,
							height: 250,
						},
						lazy: false,
					},
				},
			},
		},
	},
	slots: {},
	slotGroups: {
		VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
	},
	services: {
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['cdm-zone-01', 'cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=gamepedia',
			fallback: fallbackInstantConfig,
		},
		taxonomy: {
			enabled: false,
		},
	},
	src: 'gamepedia',
	state: {
		adStack: [],
		isMobile: false,
	},
	vast: {
		adUnitId:
			'/{custom.dfpId}/gamepedia/{slotConfig.adProduct}/{state.deviceType}/' +
			'{targeting.skin}-{targeting.s2}/_gp_wiki-gamepedia',
	},
	templates: {},
};
