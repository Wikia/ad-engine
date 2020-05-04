import { FuncPipelineStep } from '@ad-engine/core';
import { AdInfoContext } from '@ad-engine/tracking';

export const slotBillTheLizardStatusTrackingMiddleware: FuncPipelineStep<AdInfoContext> = (
	{ data, slot },
	next,
) => {
	return next({
		slot,
		data: {
			...data,
			btl: slot.getConfigProperty('btlStatus') || 'not_used',
		},
	});
};
