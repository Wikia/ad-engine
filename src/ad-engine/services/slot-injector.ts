import { logger } from '../utils';
import { isInTheSameViewport } from '../utils/dimensions';
import { context } from './context-service';

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
	inject(slotName: string): HTMLElement | null {
		const config = context.get(`slots.${slotName}`);
		let anchorElements = Array.prototype.slice.call(
			document.querySelectorAll(config.insertBeforeSelector),
		);
		const conflictingElements = Array.prototype.slice.call(
			document.querySelectorAll(config.avoidConflictWith),
		);

		if (config.repeat && config.repeat.insertBelowScrollPosition) {
			const scrollPos = window.scrollY;

			anchorElements = anchorElements.filter((el) => el.offsetTop > scrollPos);
		}

		const nextSibling = findNextSuitablePlace(anchorElements, conflictingElements);

		if (!nextSibling) {
			logger(logGroup, `There is not enough space for ${slotName}`);

			return null;
		}

		const disablePushOnScroll = config.repeat ? !!config.repeat.disablePushOnScroll : false;
		const container = insertNewSlot(slotName, nextSibling, disablePushOnScroll);

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
