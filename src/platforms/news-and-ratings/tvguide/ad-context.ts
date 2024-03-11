export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			videoEnabled: false,
			amazonId: '3115',
			bidsRefreshing: {
				slots: [
					'mpu-plus-top',
					'mpu-middle',
					'mpu-bottom',
					'mobile-banner-plus',
					'mobile-incontent-plus',
					'incontent-leader-plus-bottom',
					'incontent-leader-plus-inc',
				],
			},
		},
		prebid: {
			enabled: false,
			bidsRefreshing: {
				slots: [
					'mpu-plus-top',
					'mpu-middle',
					'mpu-bottom',
					'mobile-banner-plus',
					'mobile-incontent-plus',
					'incontent-leader-plus-bottom',
					'incontent-leader-plus-inc',
				],
			},
		},
	},
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'tvguide',
		timeouts: {
			bidder: 1000,
		},
	},
	services: {
		anyclip: {
			enabled: false,
			pubname: '2079',
			incontentPlayerWidgetname: '001w000001Y8ud2AAB_M8046',
			miniPlayerWidgetname: '001w000001Y8ud2AAB_M7985',
			libraryUrl: '//player.anyclip.com/anyclip-widget/lre-widget/prod/v1/src/lre.js',
			loadWithoutAnchor: true,
		},
		doubleVerify: {
			slots: ['mpu-plus-top', 'top_leaderboard'],
		},
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/11359/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu-plus-top'],
		},
	},
	slots: {},
	src: ['tvguide'],
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
