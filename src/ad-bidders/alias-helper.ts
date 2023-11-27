import { context, slotService } from '@ad-engine/core';

export function getSlotAlias(slotName: string, a9?: boolean): string | undefined {
	const slot = context.get(`slots.${slotName}`);

	return (a9 && slot?.a9Alias) || slot?.bidderAlias;
}

export function getSlotAliasOrName(slotName: string, a9?: boolean): string {
	return getSlotAlias(slotName, a9) || slotName;
}

export function getSlotNameByBidderAlias(id: string, a9?: boolean): string {
	let slotName = id;

	if (Object.entries(context.get(`slots.${slotName}`) || {}).length === 0) {
		slotName = findSlotNamesForBidderAlias(id, a9).shift();

		if (!slotName) {
			return '';
		}
	}

	return slotName;
}

function findSlotNamesForBidderAlias(alias: string, a9?: boolean): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([, config]) => config.bidderAlias === alias || (a9 && config.a9Alias === alias))
		.map(([name]) => name);
}
