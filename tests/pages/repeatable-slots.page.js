import { helpers } from '../common/helpers';
import { slots } from '../common/slot-registry';

class RepeatableSlots {
	constructor() {
		this.pageLink = 'slots/repeatable-slots/';
	}

	/**
	 * Scrolls between boxads
	 * @param currentBoxad {string} currently visible boxad
	 * @param {number} distance to scroll
	 */
	scrollBetweenBoxads(currentBoxad, distance = 2250) {
		helpers.slowScroll(distance, currentBoxad);
	}

	getRepeatableSlotSelector(slotNumber) {
		return `${slots.repeatableBoxad.selector}${slotNumber}`;
	}
}

export const repeatableSlots = new RepeatableSlots();
