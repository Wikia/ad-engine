import { AdSlot } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { events, eventService } from './events';
import { SlotCreator, SlotCreatorConfig } from './slot-creator';
import { slotService } from './slot-service';

const logGroup = 'slot-repeater';

class SlotInjector {
	private slotCreator = new SlotCreator();

	constructor() {
		eventService.on(events.AD_SLOT_CREATED, (adSlot: AdSlot) => {
			const slotsToPush: string[] = adSlot.getSlotsToPushAfterCreated();

			slotsToPush.forEach((slotName: string) => {
				const slotElement = this.inject(slotName, true);

				if (slotElement) {
					slotService.pushSlot(slotElement);
				} else {
					logger(logGroup, `Could not push slot ${slotName}.`);
				}
			});
		});

		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (adSlot: AdSlot) => {
			const slotsToInject: string[] = adSlot.getSlotsToInjectAfterRendered();

			slotsToInject.forEach((slotName: string) => {
				this.inject(slotName);
			});
		});
	}

	inject(slotName: string, disablePushOnScroll?: boolean): HTMLElement | null {
		let container: HTMLElement;
		const config = context.get(`slots.${slotName}`);
		const slotConfig: SlotCreatorConfig = {
			slotName,
			anchorSelector: config.insertBeforeSelector,
			insertMethod: 'before',
		};

		if (config.insertBelowFirstViewport) {
			config.anchorPosition = 'belowFirstViewport';
		}

		if (config.repeat && config.repeat.insertBelowScrollPosition) {
			config.anchorPosition = 'belowScrollPosition';
		}

		if (config.avoidConflictWith) {
			config.avoidConflictWith = [config.avoidConflictWith];
		}

		try {
			container = this.slotCreator.createSlot(slotConfig);
		} catch (e) {
			logger(logGroup, `There is not enough space for ${slotName}`);
			console.error(e);

			return null;
		}

		if (disablePushOnScroll === false) {
			context.push('events.pushOnScroll.ids', slotName);
		}

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
