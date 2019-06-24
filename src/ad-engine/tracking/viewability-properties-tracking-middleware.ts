import { AdViewabilityContext } from '@wikia/ad-tracking';
import { Middleware } from '../utils';

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
