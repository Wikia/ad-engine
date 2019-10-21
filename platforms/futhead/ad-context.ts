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
				placementsMap: {
					'cdm-zone-01': {
						uid: '5d84d69843-188',
						style: {
							'z-index': '100',
							'margin-top': '.75rem',
							'margin-bottom': '.75rem',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					'cdm-zone-02': {
						uid: '5d84d69bf2-188',
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
						uid: '5d84d69f64-188',
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
						uid: '5d84d6a2db-188',
						style: {
							'z-index': '100',
							'margin-top': '.75rem',
							'margin-bottom': '.75rem',
						},
						size: {
							width: 728,
							height: 90,
						},
						lazy: false,
					},
					'cdm-zone-06': {
						uid: '5d84d6a675-188',
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
		durationMedia: {
			enabled: false,
			siteId: '1068',
		},
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		instantConfig: {
			endpoint: 'https://services.fandom.com/icbm/api/config?app=futhead',
			fallbackConfigKey: 'fallbackInstantConfig',
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
