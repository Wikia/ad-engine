import { getCurrentBucket } from '../bucketing/getCurrentBucket';
import { checkForBucketOverlap } from '../bucketing/validation';
import { Experiment } from '../types';
import { checkDateRange } from '../utils/checkDateRange';
import { buildExperimentLoggerFunctions } from '../utils/log';

/** Gets the current available experiment for the given user bucket. */
export default function getExperiment(
	experiments: Array<Experiment>,
	customUserIdentifierFunc?: () => string,
): Experiment | null {
	const log = buildExperimentLoggerFunctions('getExperiment');

	// deep copy the experiments array to avoid modifying the original one
	const definedExperiments: Array<Experiment> = Object.assign([], experiments);

	// check buckets overlap
	const overlappingBuckets = checkForBucketOverlap(
		definedExperiments.map((experiment) => experiment.buckets).flat(),
	);

	// filter all disabled experiments either manually or through misconfiguration (overlapping buckets)
	// filter non-disabled experiments by active date range
	const availableExperiments = experiments
		.map((experiment) => {
			if (experiment.buckets.some((b) => overlappingBuckets.includes(b))) {
				experiment.disabled = true;
			}

			return experiment;
		})
		.filter((experiment) => !experiment.disabled)
		.filter((experiment) => checkDateRange(experiment.startDate, experiment.endDate));
	if (!availableExperiments) {
		log.debug(
			`There were no experiment available at this time, if this was not intentional please check your experiment configuration.`,
		);

		return null;
	}

	// get the current bucket for the user
	const getUniqueIdentifier =
		typeof customUserIdentifierFunc === 'function' ? customUserIdentifierFunc : getCurrentBucket;

	const userBucket = getUniqueIdentifier();

	if (!userBucket) {
		log.debug(
			`Could not retrieve the current bucket based on the identifier provided. Cannot determine which experiment is suitable to the user.`,
		);

		return null;
	}

	// return the first experiment that is available and coincides with the current bucket
	const experiment = availableExperiments.find((experiment) =>
		experiment.buckets.includes(userBucket),
	);

	if (!experiment) {
		log.debug(
			`There were no experiment available with the current bucket: ${userBucket}. If this was not intentional please check your experiment configuration.`,
		);

		return null;
	}

	return experiment || null;
}
