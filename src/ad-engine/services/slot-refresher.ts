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
	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	async init() {
		const config: Config = {
			...defaultConfig,
			...(context.get('services.slotRefresher.config') as Config),
		};
		const disabled = config.slots.length < 1;
		if (disabled || (await isUAP())) {
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

		this.log('enabled', config);
	}
}

export const slotRefresher = new SlotRefresher();
