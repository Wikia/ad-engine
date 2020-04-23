import { AdViewabilityContext } from '@ad-engine/tracking';
import { Middleware } from '../pipeline/middleware/middleware-types';

export const viewabilityPropertiesTrackingMiddleware: Middleware<AdViewabilityContext> = (
	{ data, slot },
	next,
) => {
	return next({
		slot,
		data: {
			...data,
			creative_id: slot.creativeId || '',
			line_item_id: slot.lineItemId || '',
			rv: slot.getConfigProperty('targeting.rv') || '',
			wsi: slot.getConfigProperty('targeting.wsi') || '',
		},
	});
};
