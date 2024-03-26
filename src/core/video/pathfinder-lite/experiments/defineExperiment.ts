import { validateBucket } from '../bucketing/validation';
import { BucketType, Experiment, ExperimentInfo } from '../types';
import getValueFromQuery from '../utils/getValueFromQuery';
import { buildExperimentLoggerFunctions } from '../utils/log';

export default function defineExperiment({
	name,
	buckets,
	disabled,
	startDate,
	endDate,
}: ExperimentInfo) {
	const log = buildExperimentLoggerFunctions(name);
	let disabledByMisconfiguration = false;

	// Log an error & disable experiment if no buckets are defined
	if (!buckets?.length) {
		log.debug(`No buckets found for experiment [${name}]. Experiment will not be active.`);
		disabledByMisconfiguration = true;
	}

	// check if buckets are valid
	const bucketValidation = validateBucket(buckets);
	if (BucketType.Invalid === bucketValidation) {
		log.debug(
			`The current bucket(s) [${buckets}] for experiment [${name}], are invalid. Experiment will not be active.`,
		);
		disabledByMisconfiguration = true;
	}

	/* Check if there are any query param provided from the browser for start/end dates of the experiment
	The browser query param is a combination of the experiment name, followed by '-start-date' or '-end-date'.
	An example of the start date query param for an experiment called 'my-sample-experiment' would be
	'?my-sample-experiment-start-date=2022-10-06T00:00:00' where '?' is the query param for the browser. */
	const startDateQueryParam = Date.parse(getValueFromQuery(`${name}-start-date`));
	console.debug(`startDateQueryParam: ${startDateQueryParam}`);
	const endDateQueryParam = Date.parse(getValueFromQuery(`${name}-end-date`));
	console.debug(`endDateQueryParam: ${endDateQueryParam}`);

	/* If no query param is found or if it can't be parsed, then use the provided startDate param.
	If a query param is passed in, then use that as the startDate for configuring the experiment,
	and overwrite the passed in startDate value. */
	startDate = isNaN(startDateQueryParam) ? startDate : startDateQueryParam;
	console.debug(`startDate: ${startDate}`);
	endDate = isNaN(endDateQueryParam) ? endDate : endDateQueryParam;
	console.debug(`endDate: ${endDate}`);

	const experiment: Experiment = {
		name,
		buckets,
		disabled: disabled || disabledByMisconfiguration,
		startDate,
		endDate,
		log,
	};

	return experiment;
}
