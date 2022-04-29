import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { logger } from '../utils';
import { context, GptProvider } from '@ad-engine/core';

const logGroup = 'slot-reloader';

interface Config {
	timeoutMS?: number;
	slots?: string[];
}
const defaultConfig: Config = {
	timeoutMS: 30000,
	slots: [],
};

async function isUAP(): Promise<boolean> {
	return new Promise((resolve) => {
		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			resolve(action.isLoaded);
		});
	});
}

class SlotReloader {
	log(message) {
		logger(logGroup, message);
	}

	async init() {
		const config: Config = {
			...defaultConfig,
			...context.get('services.slotRefresher.config') as Config,
		};
		debugger;
		const enabled = config.slots.length > 0;
		if (enabled && (await isUAP())) {
			this.log('disabled');
			return;
		}

		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) => {
			if (!config.slots.includes(slot.getSlotName())) return;
			setTimeout(() => {
				if (slot.isEnabled()) {
					this.log(`refreshing ${slot.getSlotName()}.`);
					GptProvider.refreshSlot(slot);
				}
			}, config.timeoutMS);
		});

		this.log('enabled');
	}
}

export const slotReloader = new SlotReloader();
