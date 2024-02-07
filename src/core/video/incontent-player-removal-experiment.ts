import defineExperiment from '@wikia/pathfinder-lite/experiments/defineExperiment';
import getExperiment from '@wikia/pathfinder-lite/experiments/getExperiment';
import { Experiment } from '@wikia/pathfinder-lite/types';
import { context } from '../../index';

export const incontentPlayerRemovalVariants = {
	desktopControl: 'incontent-player-removal-experiment-desktop-control',
	desktopActive: 'incontent-player-removal-experiment-desktop-active',
	mobileControl: 'incontent-player-removal-experiment-mobile-control',
	mobileActive: 'incontent-player-removal-experiment-mobile-active',
};

type RunningExperimentType = Experiment | null | undefined;

const getAllExperiments = () => [
	defineExperiment({
		name: incontentPlayerRemovalVariants.desktopControl,
		buckets: ['a', 'b', 'c', 'd'],
	}),
	defineExperiment({
		name: incontentPlayerRemovalVariants.desktopActive,
		buckets: ['4', '5', '6', '7'],
	}),
	defineExperiment({
		name: incontentPlayerRemovalVariants.mobileControl,
		buckets: ['a', 'b', 'c'],
	}),
	defineExperiment({
		name: incontentPlayerRemovalVariants.mobileActive,
		buckets: ['C', 'D', 'E'],
	}),
];

let runningExperiment: RunningExperimentType;

const getRunningExperiment = (): RunningExperimentType => {
	if (typeof runningExperiment === 'undefined') {
		runningExperiment = getExperiment(getAllExperiments());
	}

	return runningExperiment;
};

const isExperimentActive = (experimentName: string): boolean => {
	return getRunningExperiment()?.name === experimentName;
};

export function isIncontentPlayerRemovalVariationActive() {
	const isMobile = context.get('state.isMobile');
	const isActive = isMobile
		? isExperimentActive(incontentPlayerRemovalVariants.mobileActive)
		: isExperimentActive(incontentPlayerRemovalVariants.desktopActive);
	const isExperimentForcefullyDisabled = !!context.get(
		'options.video.experiments.disabled.incontentPlayerRemoval',
	);

	return isActive && !isExperimentForcefullyDisabled;
}
