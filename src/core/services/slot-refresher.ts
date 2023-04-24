import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot, AdSlotEvent } from '../models';
import { GptProvider } from '../providers';
import { logger } from '../utils';
import { context } from './context-service';

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
			const isUAP = action.isLoaded || action.adProduct === 'ruap';
			resolve(isUAP);
		});
	});
}

function refreshWhenBackInViewport(adSlot) {
	function refresh(event) {
		if (event.slot.getSlotElementId() === adSlot.getSlotName()) {
			logger(logGroup, `${adSlot.getSlotName()} back in the viewport, refreshing.`, event);
			GptProvider.refreshSlot(adSlot);
			window.googletag.pubads().removeEventListener('slotVisibilityChanged', refresh);
		}
	}
	window.googletag.pubads().addEventListener('slotVisibilityChanged', refresh);
}

class SlotRefresher {
	config: Config;
	slotsInTheViewport: Array<string> = [];

	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.config.slots.includes(adSlot.getSlotName())) return;

		setTimeout(() => {
			if (adSlot.isEnabled()) {
				this.log(`${adSlot.getSlotName()} will be refreshed.`);

				if (this.slotsInTheViewport.includes(adSlot.getSlotName())) {
					this.log(`refreshing ${adSlot.getSlotName()}`);
					GptProvider.refreshSlot(adSlot);
					return;
				}

				this.log(`${adSlot.getSlotName()} waiting for being in viewport.`);
				refreshWhenBackInViewport(adSlot);
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

		communicationService.onSlotEvent(AdSlotEvent.SLOT_VIEWED_EVENT, ({ adSlotName, slot }) => {
			logger(`${adSlotName} viewed`);
			this.refreshSlot(slot);
		});

		communicationService.onSlotEvent(AdSlotEvent.SLOT_BACK_TO_VIEWPORT, ({ adSlotName }) => {
			this.slotsInTheViewport.push(adSlotName);
		});

		communicationService.onSlotEvent(AdSlotEvent.SLOT_LEFT_VIEWPORT, ({ adSlotName }) => {
			this.slotsInTheViewport = this.slotsInTheViewport.filter(
				(slotName) => slotName !== adSlotName,
			);
		});

		logger('enabled', this.config);
	}

	async init() {
		this.setupSlotRefresher(context.get('services.slotRefresher.config'), await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
