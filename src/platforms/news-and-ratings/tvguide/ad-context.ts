export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	bidders: {
		bidsRefreshing: {
			slots: [
				'mpu-plus-top',
				'mpu-middle',
				'mpu-bottom',
				'mobile-incontent-plus',
				'incontent-leader-plus-bottom',
				'incontent-leader-plus-inc',
			],
		},
	},
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'tvguide',
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
			libraryUrl: '//tag.durationmedia.net/sites/11359/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu-plus-top'],
		},
		instantConfig: {
			appName: 'tvguide',
		},
	},
	slots: {},
	src: ['tvguide'],
};
