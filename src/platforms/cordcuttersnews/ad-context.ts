export const basicContext = {
	// based on the current requests it'd be something more like:
	// /{custom.dfpId}/{custom.property}/{targeting.pageCategory}/{targeting.pageType}/{slotConfig.targeting.pos}
	adUnitId: '/{custom.dfpId}/{custom.property}/blog/article/{slotConfig.targeting.pos}',
	custom: {
		dfpId: '5441',
		property: 'ccn',
	},
	src: ['cordcuttersnews'],
};
