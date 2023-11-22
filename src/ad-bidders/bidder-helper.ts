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

export function hasCorrectBidGroup(code: string, group: string | undefined) {
	const slotBidGroups = getSlotBidGroup(code);

	if (group) {
		return slotBidGroups && Array.isArray(slotBidGroups) && slotBidGroups.includes(group);
	}

	return !slotBidGroups || (Array.isArray(slotBidGroups) && slotBidGroups.length === 0);
}

export function getSlotBidGroup(code: string) {
	let slotBidGroups = context.get(`slots.${code}.bidGroup`);

	if (!slotBidGroups && isUsedAsAlias(code)) {
		const bidderAlias = Object.keys(context.get('slots')).find((slotName) => {
			const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

			return bidderAlias === code && slotService.getState(slotName);
		});
		slotBidGroups = context.get(`slots.${bidderAlias}.bidGroup`);
	}

	return slotBidGroups;
}

export function isUsedAsAlias(code): boolean {
	return Object.keys(context.get('slots')).some((slotName) => {
		const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

		return bidderAlias === code && slotService.getState(slotName);
	});
}

function findSlotNamesForBidderAlias(alias: string): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([, config]) => config.bidderAlias === alias)
		.map(([name]) => name);
}
