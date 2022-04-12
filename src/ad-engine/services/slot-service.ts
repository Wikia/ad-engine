import { communicationService, eventsRepository } from '@ad-engine/communication';
import { getAdStack, utils } from '../';
import { AdSlot, Dictionary, SlotConfig } from '../models';
import { getTopOffset, logger } from '../utils';
import { context } from './context-service';
import { slotTweaker } from './slot-tweaker';

const groupName = 'slot-service';

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

class SlotService {
	slotStatuses: Dictionary<string> = {};
	slotStates: Dictionary<boolean> = {};
	slots: Dictionary<AdSlot> = {};

	/**
	 * Add new slot to register
	 */
	add(adSlot: AdSlot): void {
		const slotName = adSlot.getSlotName();

		this.slots[slotName] = adSlot;

		if (this.slotStates[slotName] === false) {
			adSlot.disable(this.slotStatuses[slotName]);
		}
		if (this.slotStates[slotName] === true) {
			adSlot.enable();
		}

		slotTweaker.addDefaultClasses(adSlot);
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_ADDED, {
			name: slotName,
			slot: adSlot,
			state: AdSlot.SLOT_ADDED_EVENT,
		});
	}

	removeAll(): void {
		Object.values(this.slots).forEach((slot) => this.remove(slot));
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
		if (id.includes('gpt_unit_')) {
			const gptSlotName = this.getGptAdSlot(id);
			this.setGptAdSlotInsertId(gptSlotName, id);

			return gptSlotName;
		}
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
		return slotService.getAllowedSlots() || {};
	}

	getAllowedSlots(): Dictionary<SlotConfig> {
		const disabledSlots = context.get('icDisabledSlots') || [];
		const allSlots = context.get('slots') || {};
		disabledSlots.forEach((slotName) => (allSlots[slotName].disabled = true));

		return allSlots;
	}

	getAtfSlotNames(): string[] {
		return Object.entries<SlotConfig>(this.slotConfigsMap)
			.filter(([, config]) => !!config.aboveTheFold)
			.map(([name]) => name);
	}

	/**
	 * Returns configuration of first call slots.
	 */
	getFirstCallSlotNames(): string[] {
		return Object.entries(this.slotConfigsMap)
			.filter(([, config]) => !!config.firstCall)
			.map(([name]) => name);
	}

	/**
	 * Returns configuration of non first call slots.
	 */
	getNonFirstCallSlotNames(): string[] {
		return Object.entries(this.slotConfigsMap)
			.filter(([, config]) => !config.firstCall)
			.map(([name]) => name);
	}

	/**
	 * Returns names of enabled slots.
	 */
	getEnabledSlotNames(): string[] {
		return Object.entries(this.slotConfigsMap)
			.filter(([, config]) => !config.disabled)
			.map(([name]) => name);
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

	/**
	 * Get GPT AdSlot
	 */
	private getGptAdSlot(id: string): AdSlot {
		const prefix = context.get('custom.serverPrefix');
		const matcher = new RegExp(`/${prefix}.[A-Z]+/(?<slotName>[a-z_]+)/`);
		const found = id.match(matcher);

		try {
			return this.slots[found['groups'].slotName];
		} catch (_) {
			throw new Error('Unsupported GPT Template slot id format');
		}
	}

	/**
	 * Set insert id for GPT Ad Slot
	 */
	private setGptAdSlotInsertId(gptAdSlot: AdSlot, id: string): void {
		gptAdSlot.setConfigProperty('insertId', id);
	}
}

export const slotService = new SlotService();
