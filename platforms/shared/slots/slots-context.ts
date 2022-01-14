import {
	AdSlot,
	context,
	getAdProductInfo,
	getAdUnitString,
	PorvataParams,
	slotService,
} from '@wikia/ad-engine';

class SlotsContext {
	addSlotSize(slotName: string, size: [number, number]): void {
		if (!context.get(`slots.${slotName}`)) {
			throw new Error('Requested ad slot is not defined in the ad context');
		}

		context.push(`slots.${slotName}.defaultSizes`, size);

		const definedViewportSizes = context.get(`slots.${slotName}.sizes`);

		if (definedViewportSizes) {
			definedViewportSizes.forEach((sizeMap) => {
				sizeMap.sizes.push(size);
			});
		}
	}

	setSlotSize(slotName: string, size: [number, number]): void {
		if (!context.get(`slots.${slotName}`)) {
			throw new Error('Requested ad slot is not defined in the ad context');
		}

		context.set(`slots.${slotName}.sizes`, []);
		context.set(`slots.${slotName}.defaultSizes`, [size]);
	}

	setupSlotVideoAdUnit(adSlot: AdSlot, params: PorvataParams): void {
		const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
		const slotConfig = {
			group: adProductInfo.adGroup,
			adProduct: adProductInfo.adProduct,
		};
		const adUnit = getAdUnitString(adSlot.getSlotName(), slotConfig);

		context.set(`slots.${adSlot.getSlotName()}.videoAdUnit`, adUnit);
	}

	setState(slotName: string, state: boolean, status?: string): void {
		const element = document.getElementById(slotName);

		slotService.setState(slotName, !!element && state, status);
	}
}

export const slotsContext = new SlotsContext();
