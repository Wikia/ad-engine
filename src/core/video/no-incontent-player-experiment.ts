import defineExperiment from '@fandom/pathfinder-lite/experiments/defineExperiment';
import getExperiment from '@fandom/pathfinder-lite/experiments/getExperiment';

const NO_INCONTENT_PLAYER_EXPERIMENT_DESKTOP = defineExperiment({
	name: 'no-incontent-player-experiment-desktop',
	buckets: ['A', 'B', 'C', 'D'],
});

const NO_INCONTENT_PLAYER_EXPERIMENT_MOBILE = defineExperiment({
	name: 'no-incontent-player-experiment-mobile',
	buckets: ['W', 'X', 'Y', 'Z'],
});

export function isNoInContentVideoVariationActive() {
	const experiment = getExperiment([
		NO_INCONTENT_PLAYER_EXPERIMENT_DESKTOP,
		NO_INCONTENT_PLAYER_EXPERIMENT_MOBILE,
	]);

	return !!experiment;
}
