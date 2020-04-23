import { Middleware } from '@ad-engine/core';
import { AdInfoContext } from '@ad-engine/tracking';

export const slotBillTheLizardStatusTrackingMiddleware: Middleware<AdInfoContext> = (
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
