import defineExperiment from '@fandom/pathfinder-lite/experiments/defineExperiment';
import getExperiment from '@fandom/pathfinder-lite/experiments/getExperiment';
import { Experiment } from '@fandom/pathfinder-lite/types';
import { context } from '../../index';

export const incontentPlayerRemovalVariants = {
	desktopControl: 'incontent-player-removal-experiment-desktop-control',
	desktopActive: 'incontent-player-removal-experiment-desktop-active',
	mobileControl: 'incontent-player-removal-experiment-mobile-control',
	mobileActive: 'incontent-player-removal-experiment-mobile-active',
};

type RunningExperimentType = Experiment | null | undefined;

const getMobileExperiments = () => [
	defineExperiment({
		name: incontentPlayerRemovalVariants.mobileControl,
		buckets: ['C', 'D', 'E'],
	}),
	defineExperiment({
		name: incontentPlayerRemovalVariants.mobileActive,
		buckets: ['a', 'b', 'c'],
	}),
];

const getDesktopExperiments = () => [
	defineExperiment({
		name: incontentPlayerRemovalVariants.desktopControl,
		buckets: ['a', 'b', 'c', 'd'],
	}),
	defineExperiment({
		name: incontentPlayerRemovalVariants.desktopActive,
		buckets: ['4', '5', '6', '7'],
	}),
];

const getAllExperiments = () => {
	return context.get('state.isMobile') ? getMobileExperiments() : getDesktopExperiments();
};

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

export function isNoInContentVideoVariationActive() {
	const isMobile = context.get('state.isMobile');
	const isActive = isMobile
		? isExperimentActive(incontentPlayerRemovalVariants.mobileActive)
		: isExperimentActive(incontentPlayerRemovalVariants.desktopActive);
	const forceDisabledExperiment = !!context.get(
		'options.video.experiments.disabled.no_incontent_player',
	);

	return isActive && !forceDisabledExperiment;
}
