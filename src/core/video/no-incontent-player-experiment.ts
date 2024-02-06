import defineExperiment from '@fandom/pathfinder-lite/experiments/defineExperiment';
import getExperiment from '@fandom/pathfinder-lite/experiments/getExperiment';
import { context } from '../../index';

const NO_INCONTENT_PLAYER_EXPERIMENT = defineExperiment({
	name: 'no-incontent-player-experiment',
	buckets: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], // 10.93%
});

export function isNoInContentVideoVariationActive() {
	const isExperimentActive = !!getExperiment([NO_INCONTENT_PLAYER_EXPERIMENT]);
	const forceDisabledExperiment = !!context.get(
		'options.video.experiments.disabled.no_incontent_player',
	);

	return isExperimentActive && !forceDisabledExperiment;
}
