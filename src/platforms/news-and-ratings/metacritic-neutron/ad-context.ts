export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId:
		'/{custom.dfpId}/{custom.pageType}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'metacritic',
		timeouts: {
			bidder: 1000,
		},
		pageType: 'front-door',
	},
	services: {
		doubleVerify: {
			slots: ['mpu-plus-top', 'top_leaderboard'],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11358/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu-plus-top'],
		},
	},
	slots: {},
	src: ['metacritic'],
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
