export const basicContext = {
	adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}',
	custom: {
		dfpId: '5441',
		region: 'aw',
		property: 'tvguide',
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
			slots: ['mpu-plus-top'],
		},
		instantConfig: {
			appName: 'tvguide',
		},
	},
	slots: {},
	src: ['tvguide'],
	vast: {
		adUnitId: '/{custom.dfpId}/{custom.region}-{custom.property}/video',
	},
};
