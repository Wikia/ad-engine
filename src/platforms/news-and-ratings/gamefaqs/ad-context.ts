export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'gamefaqs',
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
		anyclip: {
			pubname: '1999',
			widgetname: '001w000001Y8ud2AAB_M7731',
			libraryUrl: '//player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js',
		},
		doubleVerify: {
			slots: ['mpu_top', 'top_leaderboard'],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11354/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu_top'],
		},
	},
	slots: {},
	src: ['gamefaqs'],
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
