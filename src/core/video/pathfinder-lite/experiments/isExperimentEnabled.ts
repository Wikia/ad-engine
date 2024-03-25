import { InstantConfigService } from '../../../services';
import { Experiment } from '../types';

type RunningExperimentType = Experiment | null | undefined;

export default function isExperimentEnabled(
	instantConfig: InstantConfigService,
	experimentName: string,
	experiment: RunningExperimentType,
): boolean {
	return instantConfig.get('icExperiments', []).includes(experimentName) && !!experiment;
}
