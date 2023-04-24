import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, AdSlotStatus, Dictionary, SlotConfig } from '../models';
import { AdSlotEvent } from '../models/ad-slot-event';
import { LazyQueue, logger } from '../utils';
import { context } from './context-service';
import { slotService } from './slot-service';

type FillInCallback = (adSlot: AdSlot) => void;

const logGroup = 'btf-blocker';

class BtfBlockerService {
	firstCallEnded = false;
	unblockedSlotNames: string[] = [];
	slotsQueue: LazyQueue;

	constructor() {
		this.resetState();
	}

	/**
	 * @private
	 */
	resetState(): void {
		this.firstCallEnded = false;
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

	init(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot: adSlot }) => {
			logger(logGroup, adSlot.getSlotName(), 'Slot rendered');
			if (!this.firstCallEnded && adSlot.isFirstCall()) {
				this.finishFirstCall();
			}
		});

		const enabledFirstCallSlots = slotService
			.getFirstCallSlotNames()
			.filter((slotName) => slotService.getEnabledSlotNames().includes(slotName));

		if (enabledFirstCallSlots.length === 0) {
			this.finishFirstCall();
		}
	}

	finishFirstCall(): void {
		this.firstCallEnded = true;
		logger(logGroup, 'first call queue finished');

		if (window.ads.runtime.disableSecondCall) {
			this.disableSecondCall([]);
		} else if (window.ads.runtime.disableBtf) {
			this.disableSecondCall([...this.unblockedSlotNames, ...slotService.getAtfSlotNames()]);
		}

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, () => {
			this.slotsQueue.flush();
		});
	}

	private disableSecondCall(unblockedSlots: string[]): void {
		const slots: Dictionary<SlotConfig> = context.get('slots') || {};

		logger(logGroup, 'second call queue disabled');

		Object.keys(slots).forEach((adSlotKey) => {
			const slotConfig = slots[adSlotKey];

			if (!slotConfig.firstCall && unblockedSlots.indexOf(adSlotKey) === -1) {
				slotService.disable(adSlotKey, AdSlotStatus.STATUS_BLOCKED);
			}
		});
	}

	push(adSlot: AdSlot, fillInCallback: FillInCallback): void {
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

	private disableAdSlotIfHasConflict(adSlot: AdSlot): void {
		if (slotService.hasViewportConflict(adSlot)) {
			slotService.disable(adSlot.getSlotName(), AdSlotStatus.STATUS_VIEWPORT_CONFLICT);
		}
	}

	private fillInSlotIfEnabled(adSlot: AdSlot, fillInCallback: FillInCallback): void {
		if (!adSlot.isEnabled()) {
			logger(logGroup, adSlot.getSlotName(), 'Slot blocked', adSlot.getStatus());

			return;
		}

		logger(logGroup, adSlot.getSlotName(), 'Filling in slot');
		fillInCallback(adSlot);
	}

	unblock(slotName: string): void {
		logger(logGroup, slotName, 'Unblocking slot');

		this.unblockedSlotNames.push(slotName);
		slotService.enable(slotName);
	}
}

export const btfBlockerService = new BtfBlockerService();
