export const basicContext = {
	adUnitId: '',
	custom: {
		dfpid: '5441',
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
	},
	slotGroup: {
		VIDEO: ['FEATURED', 'UAP_BFAA', 'UAP_BFAB', 'ABCD', 'VIDEO'],
	},
	src: 'ns',
	vast: {
		adUnitId: '',
	},
};
