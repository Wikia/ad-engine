import defineExperiment from '@fandom/pathfinder-lite/experiments/defineExperiment';
import getExperiment from '@fandom/pathfinder-lite/experiments/getExperiment';

const NO_INCONTENT_PLAYER_EXPERIMENT = defineExperiment({
	name: 'no-incontent-player-experiment-desktop',
	buckets: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], // 10.93%
});

export function isNoInContentVideoVariationActive() {
	const experiment = getExperiment([NO_INCONTENT_PLAYER_EXPERIMENT]);

	return !!experiment;
}
