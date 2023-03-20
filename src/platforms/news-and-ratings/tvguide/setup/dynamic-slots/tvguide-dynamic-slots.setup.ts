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
			console.log('spa stack start');
			communicationService.on(
				eventsRepository.PLATFORM_AD_PLACEMENT_READY,
				({ placementId }) => {
					utils.logger('spa setup', 'Ad placement rendered', placementId);
					console.log('spa', this.repeatedSlotsCounter);
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

		communicationService.on(
			eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE,
			() => {
				console.log('spa cleaning');
				this.repeatedSlotsCounter = {};
			},
			false,
		);

		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				this.refreshStaleSlots();
			},
			false,
		);
	}

	private scheduleRepeatedSlotInjection(placementId: string): void {
		const counter = this.repeatedSlotsCounter[placementId];
		const [currentSlotName, nextSlotName] =
			counter === 1
				? [placementId, `${placementId}-2`]
				: [`${placementId}-${counter}`, `${placementId}-${counter + 1}`];
		console.log('spa schedule', placementId, currentSlotName, nextSlotName);
		communicationService.onSlotEvent(
			AdSlot.SLOT_RENDERED_EVENT,
			() => {
				insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
			},
			currentSlotName,
			true,
		);

		this.repeatedSlotsCounter[placementId] = counter + 1;
	}

	private refreshStaleSlots(): void {
		const domSlotsElements = document.querySelectorAll('div[data-slot-loaded="true"].gpt-ad');

		domSlotsElements.forEach((slot) => {
			console.log('spa reinjecting', slot.getAttribute('data-ad'));
			communicationService.emit(eventsRepository.PLATFORM_AD_PLACEMENT_READY, {
				placementId: slot.getAttribute('data-ad'),
			});
		});
	}

	private isSlotApplicable(slotName: string): boolean {
		return Object.keys(context.get('slots')).includes(slotName);
	}

	private getSlotConfig(slotName: string, baseSlotName = ''): SlotSetupDefinition {
		const domSlotElement: HTMLElement =
			document.getElementById(slotName) ||
			document.querySelector(`div[data-ad="${baseSlotName || slotName}"]:not(.gpt-ad)`);

		if (!domSlotElement || !this.isSlotApplicable(slotName)) {
			utils.logger('setup', 'Slot is not applicable or placement not exists', slotName);
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
		context.set(`slots.${slotName}.bidderAlias`, slotName);
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
