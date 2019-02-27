import { LazyQueue, logger } from '../utils';
import { context } from './context-service';
import { events } from './events';
import { slotService } from './slot-service';

const logGroup = 'btf-blocker';

class BtfBlockerService {
	constructor() {
		this.resetState();
	}

	/**
	 * @private
	 */
	resetState() {
		this.firstCallEnded = false;
		/** @type {string[]}  */
		this.unblockedSlotNames = [];

		this.slotsQueue = new LazyQueue();
		this.slotsQueue.onItemFlush(({ adSlot, fillInCallback }) => {
			logger(logGroup, adSlot.getSlotName(), 'Filling delayed second call slot');
			this.disableAdSlotIfHasConflict(adSlot);
			this.fillInSlotIfEnabled(adSlot, fillInCallback);
		});

		if (window.ads && window.ads.runtime) {
			window.ads.runtime.disableBtf = false;
			window.ads.runtime.disableSecondCall = false;
		}
	}

	init() {
		context.push('listeners.slot', {
			onRenderEnded: (adSlot) => {
				logger(logGroup, adSlot.getSlotName(), 'Slot rendered');
				if (!this.firstCallEnded && adSlot.isFirstCall()) {
					this.finishFirstCall();
				}
			},
		});
		events.on(events.PAGE_CHANGE_EVENT, () => {
			this.resetState();
		});
	}

	finishFirstCall() {
		this.firstCallEnded = true;
		logger(logGroup, 'first call queue finished');

		if (window.ads.runtime.disableSecondCall) {
			this.disableSecondCall([]);
		} else if (window.ads.runtime.disableBtf) {
			this.disableSecondCall([
				...this.unblockedSlotNames,
				...slotService.getAtfSlotConfigs().map((slot) => slot.slotName),
			]);
		}

		this.slotsQueue.flush();
	}

	/**
	 * @private
	 */
	disableSecondCall(unblockedSlots) {
		const slots = context.get('slots');

		logger(logGroup, 'second call queue disabled');

		Object.keys(slots).forEach((adSlotKey) => {
			const slotConfig = slots[adSlotKey];

			if (!slotConfig.firstCall && unblockedSlots.indexOf(adSlotKey) === -1) {
				slotService.disable(adSlotKey, 'blocked');
			}
		});
	}

	push(adSlot, fillInCallback) {
		if (!this.firstCallEnded && !adSlot.isFirstCall()) {
			this.slotsQueue.push({
				adSlot,
				fillInCallback,
			});
			logger(logGroup, adSlot.getSlotName(), 'second call slot pushed to queue');

			return;
		}

		this.disableAdSlotIfHasConflict(adSlot);
		this.fillInSlotIfEnabled(adSlot, fillInCallback);
	}

	/**
	 * @private
	 */
	disableAdSlotIfHasConflict(adSlot) {
		if (slotService.hasViewportConflict(adSlot)) {
			slotService.disable(adSlot.getSlotName(), 'viewport-conflict');
		}
	}

	/**
	 * @private
	 */
	fillInSlotIfEnabled(adSlot, fillInCallback) {
		if (!adSlot.isEnabled()) {
			logger(logGroup, adSlot.getSlotName(), 'Slot blocked', adSlot.getStatus());

			return;
		}

		logger(logGroup, adSlot.getSlotName(), 'Filling in slot');
		fillInCallback(adSlot);
	}

	unblock(slotName) {
		logger(logGroup, slotName, 'Unblocking slot');

		this.unblockedSlotNames.push(slotName);
		slotService.enable(slotName);
	}
}

export const btfBlockerService = new BtfBlockerService();
