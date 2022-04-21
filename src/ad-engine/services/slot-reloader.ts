import { communicationService } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { logger } from '../utils';
import { context, GptProvider } from '@ad-engine/core';

const logGroup = 'slot-reloader';

class SlotReloader {
	log(message) {
		logger(logGroup, message);
	}
	init(): void {
		if (context.get('services.durationMedia.enabled')) {
			this.log('disabled');
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) => {
			setTimeout(() => {
				if (slot.isEnabled()) {
					this.log(`refreshing ${slot.getSlotName()}.`);
					GptProvider.refreshSlot(slot);
				}
			}, 30000);
		});

		this.log('enabled');
	}
}

export const slotReloader = new SlotReloader();
