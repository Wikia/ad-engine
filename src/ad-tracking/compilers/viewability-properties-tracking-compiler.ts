import { AdViewabilityContext } from '../viewability-tracker';

export const viewabilityPropertiesTrackingCompiler = ({
	data,
	slot,
}: AdViewabilityContext): AdViewabilityContext => {
	return {
		slot,
		data: {
			...data,
			creative_id: slot.creativeId || '',
			line_item_id: slot.lineItemId || '',
			rv: slot.getConfigProperty('targeting.rv') || '',
			slot_id: slot.getUid() || '',
		},
	};
};
