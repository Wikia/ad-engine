export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'tvguide',
	},
	services: {
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
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
