import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, SlotConfig } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { SlotCreator, SlotCreatorConfig } from './slot-creator';

const logGroup = 'slot-injector';

// ToDo: get rid of this class
class SlotInjector {
	private slotCreator = new SlotCreator();

	constructor() {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot: adSlot }) => {
				const slotsToInject: string[] = adSlot.getSlotsToInjectAfterRendered();

				slotsToInject.forEach((slotName: string) => {
					this.inject(slotName);
				});
			});
		});
	}

	inject(slotName: string): HTMLElement | null {
		let container: HTMLElement;
		const config: SlotConfig = context.get(`slots.${slotName}`);
		const slotConfig: SlotCreatorConfig = {
			slotName,
			anchorSelector: config.parentContainerSelector || config.insertBeforeSelector,
			insertMethod: config.parentContainerSelector ? 'append' : 'before',
			placeholderConfig: config.placeholder,
		};

		if (config.repeat && config.repeat.insertBelowScrollPosition) {
			slotConfig.anchorPosition = 'belowScrollPosition';
		}

		if (config.avoidConflictWith) {
			slotConfig.avoidConflictWith = [config.avoidConflictWith];
		}

		try {
			container = this.slotCreator.createSlot(slotConfig);
		} catch (e) {
			logger(logGroup, `There is not enough space for ${slotName}`);

			return null;
		}

		if (!!config?.repeat.disablePushOnScroll === false) {
			context.push('events.pushOnScroll.ids', slotName);
		}

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
