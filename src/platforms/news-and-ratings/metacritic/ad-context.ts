export const basicContext = {
	adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'metacritic',
	},
	services: {
		durationMedia: {
			libraryUrl: '//tag.durationmedia.net/sites/10651/dm.js',
		},
		iasPublisherOptimization: {
			slots: ['mpu_plus_top'],
		},
		instantConfig: {
			appName: 'metacritic',
		},
	},
	slots: {},
	src: ['metacritic'],
	vast: {
		adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}/video',
	},
};
