import { AdInfoContext } from '@wikia/ad-tracking';
import { Middleware } from '../utils';

export const slotPropertiesTrackingMiddleware: Middleware<AdInfoContext> = (
	{ data, slot },
	next,
) => {
	const now = new Date();
	const timestamp: number = now.getTime();
	const creativeSize: string = Array.isArray(slot.creativeSize)
		? slot.creativeSize.join('x')
		: slot.creativeSize;

	return next({
		slot,
		data: {
			...data,
			ad_load_time: timestamp - window.performance.timing.connectStart,
			ad_status: data.ad_status || slot.getStatus(),
			advertiser_id: slot.advertiserId || '',
			creative_id: slot.creativeId || '',
			creative_size: creativeSize || '',
			kv_pos: slot.getMainPositionName(),
			kv_rv: slot.getConfigProperty('targeting.rv') || '',
			kv_wsi: slot.getConfigProperty('targeting.wsi') || '',
			order_id: slot.orderId || '',
			product_lineitem_id: slot.lineItemId || '',
			slot_size: creativeSize || '',
		},
	});
};
