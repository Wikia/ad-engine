import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	getAdProductInfo,
	getAdUnitString,
	PorvataParams,
	slotService,
} from '@wikia/ad-engine';

class SlotsContext {
	addSlotSize(slotName: string, size: [number, number]): void {
		const definedViewportSizes = context.get(`slots.${slotName}.sizes`);

		context.push(`slots.${slotName}.defaultSizes`, size);
		definedViewportSizes.forEach((sizeMap) => {
			sizeMap.sizes.push(size);
		});
	}

	setupSlotVideoContext(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				context.onChange(`slots.${slot.getSlotName()}.audio`, () => this.setupSlotParameters(slot));
				context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () =>
					this.setupSlotParameters(slot),
				);
			},
			false,
		);
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

	private setupSlotParameters(slot: AdSlot): void {
		const audioSuffix = slot.config.audio === true ? '-audio' : '';
		const clickToPlaySuffix =
			slot.config.autoplay === true || slot.config.videoDepth > 1 ? '' : '-ctp';

		slot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		slot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
		slot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
	}
}

export const slotsContext = new SlotsContext();
