import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { logger } from '../utils';
import { GptProvider } from '../providers';
// import { context } from '@wikia/ad-engine';

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

function foobar(adSlot) {
	return function foo(event) {
		if (event.slot.getSlotElementId() === adSlot.getSlotName()) {
			if (event.inViewPercentage > 50) {
				logger(logGroup, `refreshing ${adSlot.getSlotName()}`, event);
				GptProvider.refreshSlot(adSlot);
				googletag.pubads().removeEventListener('slotVisibilityChanged', foo);
			} else {
				logger(logGroup, `${adSlot.getSlotName()} not visible ${event.inViewPercentage}`, event);
			}
		}
	};
}

class SlotRefresher {
	config: Config;
	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.config.slots.includes(adSlot.getSlotName())) return;

		setTimeout(() => {
			if (adSlot.isEnabled()) {
				this.log(`${adSlot.getSlotName()} will be refreshed.`);
				googletag.pubads().addEventListener('slotVisibilityChanged', foobar(adSlot));
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
		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ slot }) => {
			logger(`${slot.getSlotName()} viewed`);
			this.refreshSlot(slot);
		});
		logger('enabled', this.config);
	}

	async init() {
		this.setupSlotRefresher({ slots: ['top_boxad'], timeoutMS: 1000 }, await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
