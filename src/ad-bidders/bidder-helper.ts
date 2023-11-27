import { context, slotService } from '@ad-engine/core';

export const defaultSlotBidGroup = 'not-defined';

export function isUsedAsAlias(code, a9?: boolean): boolean {
	return Object.keys(context.get('slots')).some(
		(slotName) => getSlotAlias(slotName, a9) === code && slotService.getState(slotName),
	);
}

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

export function hasCorrectBidGroup(code: string, group: string, a9?: boolean): boolean {
	const slotBidGroup = getSlotBidGroup(code, a9);

	return slotBidGroup && slotBidGroup === group;
}

export function getSlotBidGroup(code: string, a9?: boolean): string {
	let slotBidGroup = context.get(`slots.${code}.bidGroup`);

	if (!slotBidGroup && isUsedAsAlias(code, a9)) {
		const bidderAlias = Object.keys(context.get('slots')).find((slotName) => {
			const bidderAlias = context.get(`slots.${slotName}.bidderAlias`);

			return bidderAlias === code && slotService.getState(slotName);
		});

		slotBidGroup = context.get(`slots.${bidderAlias}.bidGroup`);
	}

	return slotBidGroup || defaultSlotBidGroup;
}

function findSlotNamesForBidderAlias(alias: string, a9?: boolean): string[] {
	return Object.entries(slotService.slotConfigsMap)
		.filter(([, config]) => config.bidderAlias === alias || (a9 && config.a9Alias === alias))
		.map(([name]) => name);
}
