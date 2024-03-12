import { CompilerPartial } from '../trackers/base-tracker';

export const viewabilityPropertiesTrackingCompiler = ({
	data,
	slot,
}: CompilerPartial): CompilerPartial => {
	return {
		slot,
		data: {
			...data,
			creative_id: slot.creativeId || '',
			line_item_id: slot.lineItemId || '',
			rv: slot.getTargetingProperty('rv') || '',
			slot_id: slot.getUid() || '',
		},
	};
};
