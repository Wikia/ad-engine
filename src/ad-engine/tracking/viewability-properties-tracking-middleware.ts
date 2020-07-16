import { AdViewabilityContext } from '@ad-engine/tracking';
import { FuncPipelineStep } from '../pipeline/imps/func-pipeline';

export const viewabilityPropertiesTrackingMiddleware: FuncPipelineStep<AdViewabilityContext> = (
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
			slot_id: slot.getUid() || '',
			wsi: slot.getConfigProperty('targeting.wsi') || '',
		},
	});
};
