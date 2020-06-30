import {
	AdSlot,
	context,
	getAdProductInfo,
	slotService,
	utils,
	VideoParams,
} from '@wikia/ad-engine';

class SlotsContext {
	addSlotSize(slotName: string, size: [number, number]): void {
		const definedViewportSizes = context.get(`slots.${slotName}.sizes`);

		context.push(`slots.${slotName}.defaultSizes`, size);
		definedViewportSizes.forEach((sizeMap) => {
			sizeMap.sizes.push(size);
		});
	}

	setupSlotVideoAdUnit(adSlot: AdSlot, params: VideoParams): void {
		const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
		const adUnit = utils.stringBuilder.build(
			context.get(`slots.${adSlot.getSlotName()}.videoAdUnit`) || context.get('vast.adUnitId'),
			{
				slotConfig: {
					group: adProductInfo.adGroup,
					adProduct: adProductInfo.adProduct,
				},
			},
		);

		context.set(`slots.${adSlot.getSlotName()}.videoAdUnit`, adUnit);
	}

	setState(slotName: string, state: boolean, status?: string): void {
		const element = document.getElementById(slotName);

		slotService.setState(slotName, !!element && state, status);
	}
}

export const slotsContext = new SlotsContext();
