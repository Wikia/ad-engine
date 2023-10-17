export const getOptimizelyActiveVariations = () => {
	return window.optimizely?.get?.('state').getVariationMap();
};

export const getOptimizelyTargeting = () => {
	const optimizelyVariations = getOptimizelyActiveVariations() ?? {};

	return Object.keys(optimizelyVariations).map((experimentId) => {
		return `${experimentId}_${optimizelyVariations[experimentId].id}`;
	});
};
