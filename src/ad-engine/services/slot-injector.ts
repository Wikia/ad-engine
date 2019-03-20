import { getTopOffset, getViewportHeight, logger } from '../utils';
import { isInTheSameViewport } from '../utils/dimensions';
import { context } from './context-service';

const logGroup = 'slot-repeater';

function findNextSuitablePlace(anchorElements = [], conflictingElements = []) {
	let i;

	for (i = 0; i < anchorElements.length; i += 1) {
		if (!isInTheSameViewport(anchorElements[i], conflictingElements)) {
			return anchorElements[i];
		}
	}

	return null;
}

function insertNewSlot(slotName, nextSibling, disablePushOnScroll) {
	const container = document.createElement('div');

	container.id = slotName;

	nextSibling.parentNode.insertBefore(container, nextSibling);

	if (!disablePushOnScroll) {
		context.push('events.pushOnScroll.ids', slotName);
	}

	return container;
}

class SlotInjector {
	inject(slotName, dryRun = false) {
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

		if (dryRun) {
			return true;
		}

		const disablePushOnScroll = config.repeat ? !!config.repeat.disablePushOnScroll : false;
		const container = insertNewSlot(slotName, nextSibling, disablePushOnScroll);

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
