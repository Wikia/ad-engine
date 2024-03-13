import { InstantConfigService } from '../../../services';
import { Experiment } from '../types';

type RunningExperimentType = Experiment | null | undefined;

export default function isExperimentEnabled(
	instantConfig: InstantConfigService,
	experimentName: string,
	experiment: RunningExperimentType,
): Experiment {
	return instantConfig.get('icExperiments', []).includes(experimentName) && experiment;
}
