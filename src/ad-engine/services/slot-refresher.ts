import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot } from '../models';
import { logger } from '../utils';
import { GptProvider } from '../providers';

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

function refreshWhenBackToViewport(adSlot) {
	function foo(event) {
		if (event.slot.getSlotElementId() === adSlot.getSlotName()) {
			if (event.inViewPercentage > 50) {
				logger(logGroup, `refreshing ${adSlot.getSlotName()}`, event);
				GptProvider.refreshSlot(adSlot);
				googletag.pubads().removeEventListener('slotVisibilityChanged', foo);
			} else {
				logger(logGroup, `${adSlot.getSlotName()} not visible ${event.inViewPercentage}`, event);
			}
		}
	}
	googletag.pubads().addEventListener('slotVisibilityChanged', foo);
}

class SlotRefresher {
	config: Config;
	slotsInTheViewport: Array<string> = [];

	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.config.slots.includes(adSlot.getSlotName())) return;

		setTimeout(async () => {
			if (adSlot.isEnabled()) {
				this.log(`${adSlot.getSlotName()} will be refreshed.`);

				if (this.slotsInTheViewport.includes(adSlot.getSlotName())) {
					logger(logGroup, `refreshing right away ${adSlot.getSlotName()}`);
					GptProvider.refreshSlot(adSlot);
					return;
				}

				this.log(`${adSlot.getSlotName()} waiting for being in viewport.`);
				refreshWhenBackToViewport(adSlot);
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

		communicationService.onSlotEvent(AdSlot.SLOT_VIEWED_EVENT, ({ adSlotName, slot }) => {
			logger(`${adSlotName} viewed`);
			this.refreshSlot(slot);
		});

		communicationService.onSlotEvent(AdSlot.SLOT_BACK_TO_VIEWPORT, ({ adSlotName }) => {
			logger(`${adSlotName} back in the viewport`);
			this.slotsInTheViewport.push(adSlotName);
		});

		communicationService.onSlotEvent(AdSlot.SLOT_LEFT_VIEWPORT, ({ adSlotName }) => {
			logger(`${adSlotName} left the viewport`);
			this.slotsInTheViewport = this.slotsInTheViewport.filter(
				(slotName) => slotName !== adSlotName,
			);
		});

		logger('enabled', this.config);
	}

	async init() {
		this.setupSlotRefresher({ slots: ['top_boxad'], timeoutMS: 5000 }, await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
