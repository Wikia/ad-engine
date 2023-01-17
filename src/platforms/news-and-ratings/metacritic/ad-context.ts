export const basicContext = {
	// based on https://github.com/Wikia/player1-ads-adlibrary/blob/REVSYS-1890_MoarPurge/docs/guides/getting-started.md#the-dfp-path-property
	adUnitId: '/{custom.dfpId}/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'metacritic',
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
			slots: ['mpu_plus_top'],
		},
		instantConfig: {
			appName: 'metacritic',
		},
	},
	slots: {},
	src: ['metacritic'],
};
