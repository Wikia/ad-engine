export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'gamespot',
		targeting: {
			seats: {
				session: 16,
				subsession: 4,
			},
			cookie: {
				// "consolidate" variable was added in AdLib to support sites that controlled their own cookies for session, subsession, pv.
				// It comes as true for Gamefaqs and Phoenix based sites:
				// https://github.com/Wikia/phoenix/blob/master/SiteBundle/Resources/js/src/ads/bidbarrel/adManager.js#L888
				consolidate: true,
				keyMap: {
					ftag: 'ftag',
					ttag: 'ttag',
				},
			},
		},
		timeouts: {
			bidder: 1000,
		},
	},
	services: {
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11355/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu_top'],
		},
		instantConfig: {
			appName: 'gamespot',
		},
	},
	slots: {},
	targeting: {
		seg: '',
		aamid: '',
	},
	src: ['gamespot'],
};
