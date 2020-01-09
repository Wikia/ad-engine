import { getAdStack, utils } from '../';
import { AdSlot, Dictionary, SlotConfig } from '../models';
import { getTopOffset, logger } from '../utils';
import { context } from './context-service';
import { events, eventService } from './events';
import { slotTweaker } from './slot-tweaker';

const groupName = 'slot-service';

interface SlotEvent {
	callback: (event?: any) => void;
	name: string;
}

function isSlotInTheSameViewport(
	slotHeight: number,
	slotOffset: number,
	viewportHeight: number,
	elementId: string,
): boolean {
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

eventService.on(events.PAGE_CHANGE_EVENT, () => {
	slotService.slotEvents = {};
	slotService.slotStates = {};
	slotService.slotStatuses = {};
});

class SlotService {
	slotEvents: Dictionary<SlotEvent[]> = {};
	slotStatuses: Dictionary<string> = {};
	slotStates: Dictionary<boolean> = {};
	slots: Dictionary<AdSlot> = {};

	/**
	 * Add new slot to register
	 */
	add(adSlot: AdSlot): void {
		const slotName = adSlot.getSlotName();

		this.slots[slotName] = adSlot;

		if (this.slotEvents[slotName]) {
			adSlot.events.push(...this.slotEvents[slotName]);
			delete this.slotEvents[slotName];
		}

		if (this.slotStates[slotName] === false) {
			adSlot.disable(this.slotStatuses[slotName]);
		}
		if (this.slotStates[slotName] === true) {
			adSlot.enable();
		}

		slotTweaker.addDefaultClasses(adSlot);
		eventService.emit(events.AD_SLOT_CREATED, adSlot);
	}

	/**
	 * Removes slot from register
	 */
	remove(adSlot: AdSlot): void {
		const slotName = adSlot.getSlotName();

		context.removeListeners(`slots.${slotName}`);
		adSlot.destroy();
		delete this.slots[slotName];
		delete this.slotStates[slotName];
		delete this.slotStatuses[slotName];
	}

	/**
	 * Get slot by its name or pos
	 */
	get(id: string): AdSlot {
		const [singleSlotName] = id.split(',');

		if (this.slots[singleSlotName]) {
			return this.slots[singleSlotName];
		}

		// Find slots by first targeting.pos
		let slotByPos: AdSlot = null;

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

	getSlotId(slotName: string): string {
		let uid = context.get(`slots.${slotName}.uid`);

		if (!uid) {
			uid = utils.generateUniqueId();
			context.set(`slots.${slotName}.uid`, uid);
		}

		return uid;
	}

	/**
	 * Iterate over all defined slots
	 * @param {function} callback
	 */
	forEach(callback: (adSlot: AdSlot) => void): void {
		Object.keys(this.slots).forEach((id) => {
			callback(this.slots[id]);
		});
	}

	on(slotName: string, eventName: string, callback: (payload?: any) => void): void {
		const adSlot = this.get(slotName);
		const event: SlotEvent = {
			callback,
			name: eventName,
		};

		this.slotEvents[slotName] = this.slotEvents[slotName] || [];

		if (adSlot) {
			adSlot.events.push(event);
		} else {
			this.slotEvents[slotName].push(event);
		}
	}

	/**
	 * Enable slot by name (it isn't necessary to have given ad slot in register at this point)
	 */
	enable(slotName: string): void {
		this.setState(slotName, true);
	}

	/**
	 * Disable slot by name (it isn't necessary to have given ad slot in register at this point)
	 */
	disable(slotName: string, status: string = null): void {
		this.setState(slotName, false, status);
	}

	/**
	 * Get current state of slot (it isn't necessary to have given ad slot in register at this point)
	 */
	getState(slotName: string): boolean {
		// Comparing with false in order to get truthy value for slot
		// that wasn't disabled or enabled (in case when state is undefined)
		return this.slotStates[slotName] !== false;
	}

	setState(slotName: string, state: boolean, status: string = null): void {
		const slot = this.get(slotName);

		this.slotStates[slotName] = state;
		this.slotStatuses[slotName] = status;

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
	 */
	hasViewportConflict(adSlot: AdSlot): boolean {
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

	get slotConfigsMap(): Dictionary<SlotConfig> {
		return context.get('slots') || {};
	}

	getAtfSlotNames(): string[] {
		return Object.entries<SlotConfig>(this.slotConfigsMap)
			.filter(([name, config]) => !!config.aboveTheFold)
			.map(([name, config]) => name);
	}

	/**
	 * Returns configuration of first call slots.
	 */
	getFirstCallSlotNames(): string[] {
		return Object.entries(this.slotConfigsMap)
			.filter(([name, config]) => !!config.firstCall)
			.map(([name, config]) => name);
	}

	/**
	 * Returns names of enabled slots.
	 */
	getEnabledSlotNames(): string[] {
		return Object.entries(this.slotConfigsMap)
			.filter(([name, config]) => !config.disabled)
			.map(([name, config]) => name);
	}

	pushSlot(node: HTMLElement): void {
		const adStack = getAdStack();

		if (adStack) {
			logger(groupName, `Push slot ${node.id} to adStack.`);
			adStack.push({
				id: node.id,
			});
		} else {
			logger(groupName, `Could not push slot ${node.id} because adStack is not present.`);
		}
	}
}

export const slotService = new SlotService();
