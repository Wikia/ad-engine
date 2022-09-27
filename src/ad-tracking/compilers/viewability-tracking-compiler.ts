import { CompilerPartial } from '../base-tracker';

export const viewabilityTrackingCompiler = ({ data, slot }: CompilerPartial): CompilerPartial => {
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
