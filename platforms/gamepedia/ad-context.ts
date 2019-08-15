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
		wad: {
			enabled: false,
			blocking: false,
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
	services: {
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		instantConfig: {
			endpoint: 'https://services.wikia.com/icbm/api/config?app=gamepedia',
			fallbackConfigKey: 'fallbackInstantConfig',
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
	targeting: {
		ae3: '1',
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
