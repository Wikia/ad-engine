import { context } from '@wikia/ad-engine';

function findSlotGroup(product) {
	const slotGroups = context.get('slotGroups');
	const result = Object.keys(slotGroups).filter((name) => slotGroups[name].indexOf(product) !== -1);

	return result.length === 1 ? result[0] : null;
}

function getGroup(product) {
	return findSlotGroup(product.toUpperCase()) || 'OTHER';
}

export function getAdProductInfo(slotName, loadedTemplate, loadedProduct) {
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
