import { getTopOffset, logger } from '../utils';
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

function insertNewSlot(slotName, nextSibling) {
	const container = document.createElement('div');

	container.id = slotName;

	nextSibling.parentNode.insertBefore(container, nextSibling);
	context.push('events.pushOnScroll.ids', slotName);

	return container;
}

class SlotInjector {
	inject(slotName: string, insertBelowScrollPosition = false) {
		const config = context.get(`slots.${slotName}`);
		const minDistanceToTop = config.minDistanceFromTop || 0;
		let anchorElements = Array.prototype.slice.call(
			document.querySelectorAll(config.insertBeforeSelector),
		);
		anchorElements = anchorElements.filter((el: Element) => getTopOffset(el) > minDistanceToTop);
		const conflictingElements = Array.prototype.slice.call(
			document.querySelectorAll(config.avoidConflictWith),
		);

		if (insertBelowScrollPosition) {
			const scrollPos = window.scrollY;

			anchorElements = anchorElements.filter((el) => el.offsetTop > scrollPos);
		}

		const nextSibling = findNextSuitablePlace(anchorElements, conflictingElements);

		if (!nextSibling) {
			logger(logGroup, `There is not enough space for ${slotName}`);

			return null;
		}

		const container = insertNewSlot(slotName, nextSibling);

		logger(logGroup, 'Inject slot', slotName);

		return container;
	}
}

export const slotInjector = new SlotInjector();
