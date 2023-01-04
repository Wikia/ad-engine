import { CompilerPartial } from '../base-tracker';

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
			rv: slot.getTargetingConfigProperty('rv') || '',
			slot_id: slot.getUid() || '',
		},
	};
};
