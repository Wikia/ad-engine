import { context, slotService } from '@ad-engine/core';

export function getSlotNameByBidderAlias(id: string): string {
	let slotName = id;

	if (Object.entries(context.get(`slots.${slotName}`) || {}).length === 0) {
		slotName = findSlotNamesForBidderAlias(id).shift();

		if (!slotName) {
			return '';
		}
	}

	return slotName;
}

function findSlotNamesForBidderAlias(alias: string): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([name, config]) => config.bidderAlias === alias)
		.map(([name, config]) => name);
}
