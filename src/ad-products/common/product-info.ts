import { context, Dictionary, utils } from '@ad-engine/core';

interface AdProductInfo {
	adGroup: string;
	adProduct: string;
}

// Only F2 is using slotGroups in the context, this code could (?) be removed
function findSlotGroup(product): string {
	const slotGroups = context.get('slotGroups') || {};
	const result = Object.keys(slotGroups).filter((name) => slotGroups[name].indexOf(product) !== -1);

	return result.length === 1 ? result[0] : null;
}

function getGroup(product): string {
	return findSlotGroup(product.toUpperCase()) || 'OTHER';
}

export function getAdProductInfo(slotName): AdProductInfo {
	const product = slotName;

	return {
		adGroup: getGroup(product),
		adProduct: product.toLowerCase(),
	};
}

export function getAdUnitString(adslotName: string, slotConfig: Dictionary<unknown>): string {
	return utils.stringBuilder.build(
		context.get(`slots.${adslotName}.videoAdUnit`) || context.get('vast.adUnitId'),
		{
			slotConfig,
		},
	);
}
