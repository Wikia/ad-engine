import { AdViewabilityContext } from '../viewability-tracker';

export const viewabilityTrackingCompiler = ({
	data,
	slot,
}: AdViewabilityContext): AdViewabilityContext => {
	const now = new Date();

	return {
		slot,
		data: {
			...data,
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
		},
	};
};
