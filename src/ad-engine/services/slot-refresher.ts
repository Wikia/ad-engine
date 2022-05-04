import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { logger } from '../utils';
import { GptProvider } from '../providers';
import { context } from '@wikia/ad-engine';

const logGroup = 'slot-refresher';

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

class SlotRefresher {
	config: Config;
	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	refreshSlot(slot: AdSlot) {
		if (!this.config.slots.includes(slot.getSlotName())) return;

		setTimeout(() => {
			if (slot.isEnabled()) {
				this.log(`refreshing ${slot.getSlotName()}.`);
				GptProvider.refreshSlot(slot);
			}
		}, this.config.timeoutMS);
	}

	setupSlotRefresher(additionalConfig: Config, isUap: boolean, logger) {
		this.config = {
			...defaultConfig,
			...additionalConfig,
		};
		const disabled = this.config.slots.length < 1;
		if (disabled || isUap) {
			logger('disabled');
			return;
		}
		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) =>
			this.refreshSlot(slot),
		);
		logger('enabled', this.config);
	}

	async init() {
		this.setupSlotRefresher(context.get('services.slotRefresher.config'), await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
