export const basicContext = {
	adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'gamefaqs',
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
		confiant: {
			enabled: false,
			propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
		},
		durationMedia: {
			enabled: false,
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
		},
		iasPublisherOptimization: {
			pubId: '930616',
			slots: ['mpu_top'],
		},
		instantConfig: {
			appName: 'gamefaqs',
		},
	},
	slots: {},
	src: ['gamefaqs'],
	vast: {
		adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}/video',
	},
};
