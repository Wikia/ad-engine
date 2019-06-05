import { AdSlot } from '../models';
import { getTopOffset, getViewportHeight, logger } from '../utils';
import { isInTheSameViewport } from '../utils/dimensions';
import { context } from './context-service';
import { events, eventService } from './events';
import { slotService } from './slot-service';

const logGroup = 'slot-repeater';

function findNextSuitablePlace(
	anchorElements: HTMLElement[] = [],
	conflictingElements: HTMLElement[] = [],
): HTMLElement | null {
	let i;

	for (i = 0; i < anchorElements.length; i += 1) {
		if (!isInTheSameViewport(anchorElements[i], conflictingElements)) {
			return anchorElements[i];
		}
	}

	return null;
}

function insertNewSlot(
	slotName: string,
	nextSibling: HTMLElement,
	disablePushOnScroll: boolean,
): HTMLElement {
	const container = document.createElement('div');

	container.id = slotName;

	nextSibling.parentNode.insertBefore(container, nextSibling);

	if (!disablePushOnScroll) {
		context.push('events.pushOnScroll.ids', slotName);
	}

	return container;
}

class SlotInjector {
	constructor() {
		/**
		 * I did not create an automated way to build this code from event name
		 * to config key map because Symbol cannot be iterated over using any for loop
		 */
		eventService.on(events.AD_SLOT_CREATED, (adSlot: AdSlot) => {
			const slotsToPush: string[] = this.getPushAfterSlots(
				'pushAfterCreated',
				adSlot.getSlotName(),
			);

			slotsToPush.forEach((slotName: string) => {
				const slotElement = this.inject(slotName, true);

				if (slotElement) {
					slotService.pushSlot(slotElement);
				} else {
					logger(logGroup, `Could not inject slot ${slotName}.`);
				}
			});
		});

		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (adSlot: AdSlot) => {
			const slotsToPush: string[] = this.getPushAfterSlots(
				'pushAfterRendered',
				adSlot.getSlotName(),
			);

			slotsToPush.forEach((slotName: string) => {
				this.inject(slotName);
			});
		});
	}

	private getPushAfterSlots(
		after: 'pushAfterRendered' | 'pushAfterCreated',
		slotName: string,
	): string[] {
		return context.get(`events.${after}.${slotName}`) || [];
	}

	inject(slotName: string, disablePushOnScroll?: boolean): HTMLElement | null {
		const config = context.get(`slots.${slotName}`);

		let anchorElements = Array.prototype.slice.call(
			document.querySelectorAll(config.insertBeforeSelector),
		);

		if (config.insertBelowFirstViewport) {
			const viewportHeight = getViewportHeight();

			anchorElements = anchorElements.filter((el) => getTopOffset(el) > viewportHeight);
		}

		if (config.repeat && config.repeat.insertBelowScrollPosition) {
			const scrollPos = window.scrollY;

			anchorElements = anchorElements.filter((el) => getTopOffset(el) > scrollPos);
		}

		const conflictingElements = Array.prototype.slice.call(
			document.querySelectorAll(config.avoidConflictWith),
		);
		const nextSibling = findNextSuitablePlace(anchorElements, conflictingElements);

		if (!nextSibling) {
			logger(logGroup, `There is not enough space for ${slotName}`);

			return null;
		}

		if (typeof disablePushOnScroll !== 'boolean') {
			disablePushOnScroll = config.repeat ? !!config.repeat.disablePushOnScroll : false;
		}
		const container = insertNewSlot(slotName, nextSibling, disablePushOnScroll);

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
