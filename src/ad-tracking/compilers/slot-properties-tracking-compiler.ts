import { AdInfoContext } from '../slot-tracker';

export const slotPropertiesTrackingCompiler = ({ data, slot }: AdInfoContext): AdInfoContext => {
	return {
		slot,
		data: {
			...data,
			ad_status: data.ad_status || slot.getStatus(),
			advertiser_id: slot.advertiserId || '',
			creative_id: slot.creativeId || '',
			kv_pos: slot.getMainPositionName(),
			kv_rv: slot.getConfigProperty('targeting.rv') || '',
			order_id: slot.orderId || '',
			product_lineitem_id: slot.lineItemId || '',
			slot_id: slot.getUid() || '',
			slot_size: slot.getCreativeSize() || '',
		},
	};
};
