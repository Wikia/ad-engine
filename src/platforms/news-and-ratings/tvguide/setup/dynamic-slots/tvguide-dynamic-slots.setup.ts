import { insertSlots, SlotSetupDefinition } from '@platforms/shared';
import {
	AdSlotEvent,
	communicationService,
	context,
	Dictionary,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';

const logGroup = 'dynamic-slots';

export class TvGuideDynamicSlotsSetup implements DiProcess {
	private repeatedSlotsCounter: Dictionary<number> = {};
	private repeatedSlotsRendered: string[] = [];
	private repeatedSlotsQueue: Dictionary<[string, string]> = {};

	execute(): void {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			communicationService.on(
				eventsRepository.PLATFORM_AD_PLACEMENT_READY,
				({ placementId }) => {
					utils.logger(logGroup, 'Ad placement rendered', placementId);
					if (this.repeatedSlotsCounter[placementId]) {
						this.scheduleRepeatedSlotInjection(placementId);
						return;
					}

					this.repeatedSlotsCounter[placementId] = 1;
					insertSlots([this.getSlotConfig(placementId)]);
				},
				false,
			);

			communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ adSlotName }) => {
				this.repeatedSlotsRendered.push(adSlotName);

				if (this.repeatedSlotsQueue[adSlotName]) {
					const [nextSlotName, placementId] = this.repeatedSlotsQueue[adSlotName];
					window.requestAnimationFrame(() => {
						insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
					});
				}
			});
		});

		communicationService.on(
			eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE,
			() => {
				utils.logger(logGroup, 'Cleaning slots repositories');
				this.repeatedSlotsCounter = {};
				this.repeatedSlotsRendered = [];
				this.repeatedSlotsQueue = {};
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

		this.repeatedSlotsCounter[placementId] = counter + 1;

		if (this.repeatedSlotsRendered.includes(currentSlotName)) {
			insertSlots([this.getSlotConfig(nextSlotName, placementId)]);
			utils.logger(logGroup, 'Injecting repeated slot', nextSlotName);
		} else {
			this.repeatedSlotsQueue[currentSlotName] = [nextSlotName, placementId];
			utils.logger(logGroup, 'Scheduling repeated slot injection', nextSlotName);
		}
	}

	private refreshStaleSlots(): void {
		const domSlotsElements = document.querySelectorAll('div[data-slot-loaded="true"].gpt-ad');

		domSlotsElements.forEach((slot) => {
			utils.logger(logGroup, 'Reinjecting stale slot', slot.getAttribute('data-ad'));
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
			utils.logger(logGroup, 'Slot is not applicable or placement not exists', slotName);
			return null;
		}

		const slotConfig: SlotSetupDefinition = {
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

		if (!baseSlotName) {
			context.set(`slots.${slotName}.bidderAlias`, slotName);

			slotConfig.slotCreatorConfig.repeat = {
				index: 1,
				limit: 10,
				slotNamePattern: `{slotConfig.bidderAlias}-{slotConfig.repeat.index}`,
				updateProperties: {
					adProduct: '{slotConfig.slotName}',
					'targeting.pos': '{slotConfig.slotName}',
				},
				updateCreator: {
					anchorElement: null,
				},
			};
		}

		return slotConfig;
	}
}
