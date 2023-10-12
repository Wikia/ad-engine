export const getOptimizelyActiveVariations = () => {
	return window.optimizely?.get?.('state').getVariationMap();
};
