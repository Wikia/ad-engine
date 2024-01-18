export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'comicvine',
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
		anyclip: {
			pubname: '2033',
			miniPlayerWidgetname: '001w000001Y8ud2AAB_M7540',
			libraryUrl: '//player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/acins.js',
			loadWithoutAnchor: true,
		},
		doubleVerify: {
			slots: ['mpu_top', 'top_leaderboard'],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11353/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu_top'],
		},
	},
	slots: {},
	src: ['comicvine'],
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd',
		},
		preload: {
			gpt: false,
			audigent: true,
			prebid: true,
			apstag: false,
			intentIq: true,
		},
	},
};
