import getValueFromQuery from './getValueFromQuery';

/** Gets the value of a query parameter from the current URL with name `ss_pathfinder_force_bucket` */
export default function getForcedBucket(): string {
	const forcedBucket = getValueFromQuery('pf_pathfinder_force_bucket');

	if (typeof forcedBucket === 'undefined' || forcedBucket?.length === 0) {
		return '';
	}

	return forcedBucket;
}
