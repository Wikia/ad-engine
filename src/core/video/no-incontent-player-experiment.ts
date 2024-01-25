import { context } from '../../index';

const OPTIMIZELY_NO_INCONTENT_PLAYER_EXPERIMENT = {
	// https://app.optimizely.com/v2/projects/17632281258/experiments/27342680309/variations
	MOBILE: {
		EXPERIMENT_ID: '27342680309',
		NO_INCONTENT_PLAYER_VARIATION_ID: '27359980218',
	},
	// https://app.optimizely.com/v2/projects/17632281258/experiments/27295370448/variations
	DESKTOP: {
		EXPERIMENT_ID: '27295370448',
		NO_INCONTENT_PLAYER_VARIATION_ID: '27266830455',
	},
};

export function isNoInContentVideoVariationActive() {
	const isMobile = context.get('state.isMobile');
	const optimizelyVariationMap = window.optimizely?.get?.('state')?.getVariationMap();
	const desktopNoInContentVideoVariationActive =
		optimizelyVariationMap?.[OPTIMIZELY_NO_INCONTENT_PLAYER_EXPERIMENT.DESKTOP.EXPERIMENT_ID]
			?.id === OPTIMIZELY_NO_INCONTENT_PLAYER_EXPERIMENT.DESKTOP.NO_INCONTENT_PLAYER_VARIATION_ID &&
		!isMobile;
	const mobileNoInContentVideoVariationActive =
		optimizelyVariationMap?.[OPTIMIZELY_NO_INCONTENT_PLAYER_EXPERIMENT.MOBILE.EXPERIMENT_ID]?.id ===
			OPTIMIZELY_NO_INCONTENT_PLAYER_EXPERIMENT.MOBILE.NO_INCONTENT_PLAYER_VARIATION_ID && isMobile;
	return desktopNoInContentVideoVariationActive || mobileNoInContentVideoVariationActive;
}
