import { AdSlot, context, getAdProductInfo, getAdUnitString, slotService } from '@wikia/ad-engine';
// tslint:disable-next-line:no-blacklisted-paths
import { PorvataParams } from '../../../src/ad-products/video/porvata4/porvata-settings';

class SlotsContext {
	addSlotSize(slotName: string, size: [number, number]): void {
		const definedViewportSizes = context.get(`slots.${slotName}.sizes`);

		context.push(`slots.${slotName}.defaultSizes`, size);
		definedViewportSizes.forEach((sizeMap) => {
			sizeMap.sizes.push(size);
		});
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
