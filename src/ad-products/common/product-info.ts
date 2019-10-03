import { context } from '@ad-engine/core';

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

export function getAdProductInfo(slotName, loadedTemplate, loadedProduct): AdProductInfo {
	let product = slotName;

	if (loadedProduct === 'abcd') {
		product = 'ABCD';
	} else if (loadedProduct === 'vuap') {
		product = `UAP_${loadedTemplate.toUpperCase()}`;
	} else if (loadedProduct === 'incontent_veles') {
		product = 'OUTSTREAM';
	}

	return {
		adGroup: getGroup(product),
		adProduct: product.toLowerCase(),
	};
}
