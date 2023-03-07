import { insertSlots, SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlot,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	private repeatedSlotsCounter: Dictionary<number> = {};

	execute(): void {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			communicationService.on(
				eventsRepository.PLATFORM_AD_PLACEMENT_READY,
				({ placementId }) => {
					if (this.repeatedSlotsCounter[placementId]) {
						this.scheduleRepeatedSlotInjection(placementId);
						return;
					}

					this.repeatedSlotsCounter[placementId] = 1;
					insertSlots([this.getSlotConfig(placementId)]);
				},
				false,
			);
		});

		communicationService.on(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE, () => {
			this.repeatedSlotsCounter = {};
		});
	}

	private scheduleRepeatedSlotInjection(placementId: string): void {
		const counter = this.repeatedSlotsCounter[placementId];
		const [currentSlotName, nextSlotName] =
			counter === 1
				? [placementId, `${placementId}-2`]
				: [`${placementId}-${counter}`, `${placementId}-${counter + 1}`];

		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			if (slot.getSlotName() === currentSlotName) {
				insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
			}
		});

		this.repeatedSlotsCounter[placementId] = counter + 1;
	}

	private isSlotApplicable(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}

	private getSlotConfig(slotName: string, baseSlotName = ''): SlotSetupDefinition {
		const domSlotElement: HTMLElement = document.querySelector(
			`div[data-ad="${baseSlotName || slotName}"]:not(.gpt-ad)`,
		);

		if (!domSlotElement || !this.isSlotApplicable(slotName)) {
			utils.logger('setup', 'Slot already pushed or is not applicable', slotName);
			return null;
		}

		if (!context.get(`slots.${slotName}.repeat`)) {
			this.setupSlotRepeatContext(slotName);
		}

		return {
			slotCreatorConfig: {
				slotName,
				insertMethod: 'alter',
				anchorSelector: '',
				anchorElement: domSlotElement,
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private setupSlotRepeatContext(slotName: string): void {
		context.set(`slots.${slotName}.repeat`, {
			...context.get(`slots.${slotName}.repeat`),
			index: 1,
			limit: 10,
			slotNamePattern: `{slotConfig.bidderAlias}-{slotConfig.repeat.index}`,
			updateProperties: {
				adProduct: '{slotConfig.slotName}',
				'targeting.pos': '{slotConfig.slotName}',
			},
		});
	}
}
