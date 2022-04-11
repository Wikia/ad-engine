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

export interface SlotsContextInterface {
	addSlotSize(slotName: string, size: [number, number]): void;

	setSlotSize(slotName: string, size: [number, number]): void;

	setupSlotVideoContext(): void;

	setupSlotVideoAdUnit(adSlot: AdSlot, params: PorvataParams): void;

	setState(slotName: string, state: boolean, status?: string): void;
}

class SlotsContext implements SlotsContextInterface {
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

	removeSlotSize(slotName: string, sizeToRemove: [number, number]): void {
		if (!context.get(`slots.${slotName}`)) {
			throw new Error('Requested ad slot is not defined in the ad context');
		}

		const defaultSizes = context
			.get(`slots.${slotName}.defaultSizes`)
			.filter((size) => size != sizeToRemove);

		const sizes = context.get(`slots.${slotName}.sizes`);
		sizes[0].sizes = sizes[0].sizes.filter((size) => size != sizeToRemove);

		context.set(`slots.${slotName}.defaultSizes`, defaultSizes);
		context.set(`slots.${slotName}.sizes`, sizes);
	}

	setSlotSize(slotName: string, size: [number, number]): void {
		if (!context.get(`slots.${slotName}`)) {
			throw new Error('Requested ad slot is not defined in the ad context');
		}

		context.set(`slots.${slotName}.sizes`, []);
		context.set(`slots.${slotName}.defaultSizes`, [size]);
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
