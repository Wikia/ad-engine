import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	getAdUnitString,
	runtimeVariableSetter,
	slotService,
} from '@wikia/ad-engine';

export interface SlotsContextInterface {
	addSlotSize(slotName: string, size: [number, number]): void;

	setSlotSize(slotName: string, size: [number, number]): void;

	setupSlotVideoContext(): void;

	setState(slotName: string, state: boolean, status?: string): void;
}

class SlotsContext implements SlotsContextInterface {
	addSlotSize(slotName: string, size: [number, number]): void {
		if (!context.get(`slots.${slotName}`)) {
			throw new Error(`Requested ad slot is not defined in the ad context (${slotName})`);
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

	setupCustomPlayerAdUnit(slotName = 'incontent_player'): void {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			const params = {
				group: 'VIDEO',
				adProduct: 'incontent_video',
				slotNameSuffix: '',
			};
			const adUnit = getAdUnitString(slotName, params);

			runtimeVariableSetter.addVariable('video', { adUnit });
		});
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
		slot.setTargetingConfigProperty('audio', audioSuffix ? 'yes' : 'no');
		slot.setTargetingConfigProperty('ctp', clickToPlaySuffix ? 'yes' : 'no');
	}
}

export const slotsContext = new SlotsContext();
