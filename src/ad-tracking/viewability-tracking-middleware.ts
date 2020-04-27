import { FuncPipelineStep } from '@ad-engine/core';
import { AdViewabilityContext } from './viewability-tracker';

export const viewabilityTrackingMiddleware: FuncPipelineStep<AdViewabilityContext> = (
	{ data, slot },
	next,
) => {
	const now = new Date();

	return next({
		slot,
		data: {
			...data,
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
		},
	});
};
