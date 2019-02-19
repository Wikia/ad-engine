import { AdSlot } from '../models';
import { getTopOffset, logger } from '../utils';
import { context } from './context-service';
import { events } from './events';
import { slotTweaker } from './slot-tweaker';

const groupName = 'slot-service';
/** @type {Object.<string, AdSlot>} */
const slots = {};

let slotEvents = {};
let slotStatuses = {};
let slotStates = {};

function isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId) {
	const element = document.getElementById(elementId);

	// According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
	// Hidden element does not have offsetParent
	if (element.offsetParent === null) {
		return false;
	}

	const elementHeight = element.offsetHeight;
	const elementOffset = getTopOffset(element);
	const isFirst = elementOffset < slotOffset;
	const distance = isFirst
		? slotOffset - elementOffset - elementHeight
		: elementOffset - slotOffset - slotHeight;

	return distance < viewportHeight;
}

events.on(events.PAGE_CHANGE_EVENT, () => {
	slotEvents = {};
	slotStates = {};
	slotStatuses = {};
});

class SlotService {
	/**
	 * Add new slot to register
	 * @param {AdSlot} adSlot
	 */
	add(adSlot) {
		const slotName = adSlot.getSlotName();

		slots[slotName] = adSlot;

		if (slotStates[slotName] === false) {
			adSlot.disable(slotStatuses[slotName]);
		}
		if (slotStates[slotName] === true) {
			adSlot.enable();
		}

		slotTweaker.addDefaultClasses(adSlot);
		events.emit(events.AD_SLOT_CREATED, adSlot);

		if (slotEvents[slotName]) {
			adSlot.events.push(...slotEvents[slotName]);
			delete slotEvents[slotName];
		}
		adSlot.events.flush();
	}

	/**
	 * Removes slot from register
	 * @param {AdSlot} adSlot
	 */
	remove(adSlot) {
		const slotName = adSlot.getSlotName();

		context.removeListeners(`slots.${slotName}`);
		adSlot.disable('Marked for remove');
		delete slots[slotName];
		delete slotStates[slotName];
		delete slotStatuses[slotName];
	}

	/**
	 * Get slot by its name or pos
	 * @param id
	 * @returns {AdSlot}
	 */
	get(id) {
		const [singleSlotName] = id.split(',');

		if (slots[singleSlotName]) {
			return slots[singleSlotName];
		}

		// Find slots by first targeting.pos
		let slotByPos = null;

		this.forEach((slot) => {
			if (slotByPos !== null) {
				return;
			}

			const position = slot.getConfigProperty('targeting.pos') || [];

			if (position === singleSlotName || position[0] === singleSlotName) {
				slotByPos = slot;
			}
		});

		return slotByPos;
	}

	/**
	 * Iterate over all defined slots
	 * @param {function} callback
	 */
	forEach(callback) {
		Object.keys(slots).forEach((id) => {
			callback(slots[id]);
		});
	}

	/**
	 *
	 * @param {string} slotName
	 * @param {string} eventName
	 * @param {function} callback
	 */
	on(slotName, eventName, callback) {
		const adSlot = this.get(slotName);
		const event = {
			name: eventName,
			callback,
		};

		slotEvents[slotName] = slotEvents[slotName] || [];

		if (adSlot) {
			adSlot.events.push(event);
		} else {
			slotEvents[slotName].push(event);
		}
	}

	/**
	 * Enable slot by name (it isn't necessary to have given ad slot in register at this point)
	 * @param {string} slotName
	 */
	enable(slotName) {
		this.setState(slotName, true);
	}

	/**
	 * Disable slot by name (it isn't necessary to have given ad slot in register at this point)
	 * @param {string} slotName
	 * @param {null|string} status
	 */
	disable(slotName, status = null) {
		this.setState(slotName, false, status);
	}

	/**
	 * Get current state of slot (it isn't necessary to have given ad slot in register at this point)
	 * @param {string} slotName
	 * @returns {boolean}
	 */
	getState(slotName) {
		// Comparing with false in order to get truthy value for slot
		// that wasn't disabled or enabled (in case when state is undefined)
		return slotStates[slotName] !== false;
	}

	setState(slotName, state, status = null) {
		const slot = this.get(slotName);

		slotStates[slotName] = state;
		slotStatuses[slotName] = status;

		// After slot is created context should be read-only
		if (slot) {
			slot.setStatus(status);
			if (state) {
				slot.enable();
			} else {
				slot.disable();
			}
		} else if (state) {
			context.set(`slots.${slotName}.disabled`, false);
		} else {
			context.set(`slots.${slotName}.disabled`, true);
		}
		logger(groupName, 'set state', slotName, state);
	}

	/**
	 * Checks whether ad slot has conflict with defined elements
	 * @param {AdSlot} adSlot
	 * @returns {boolean}
	 */
	hasViewportConflict(adSlot) {
		if (!adSlot.hasDefinedViewportConflicts() || adSlot.getElement() === null) {
			return false;
		}

		const slotHeight = adSlot.getElement().offsetHeight;
		const slotOffset = getTopOffset(adSlot.getElement());
		const viewportHeight =
			window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		const hasConflict = adSlot
			.getViewportConflicts()
			.some((elementId) =>
				isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId),
			);

		logger(groupName, 'hasViewportConflict', adSlot.getSlotName(), hasConflict);

		return hasConflict;
	}

	/**
	 * Returns configuration of ATF slots.
	 * @returns {Object[]} ATF slot configs
	 */
	getAtfSlotConfigs() {
		const slotConfigs = context.get('slots');

		return Object.values(slotConfigs).filter((config) => AdSlot.isAboveTheFold(config));
	}
}

export const slotService = new SlotService();
