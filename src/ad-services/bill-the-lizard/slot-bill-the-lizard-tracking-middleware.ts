import { utils } from '@wikia/ad-engine';
import { AdInfoContext } from '@wikia/ad-tracking';

export const slotBillTheLizardStatusTrackingMiddleware: utils.Middleware<AdInfoContext> = (
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
