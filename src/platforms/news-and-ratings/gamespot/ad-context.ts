export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'gamespot',
		timeouts: {
			bidder: 1000,
		},
	},
	events: {
		pushOnScroll: {
			ids: [],
			threshold: 100,
		},
	},
	services: {
		doubleVerify: {
			slots: ['mpu_top', 'top_leaderboard'],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11355/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu_top'],
		},
	},
	slots: {},
	src: ['gamespot'],
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
