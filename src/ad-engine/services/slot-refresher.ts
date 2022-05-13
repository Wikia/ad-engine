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

async function isOutOfTheViewport(slotName): Promise<boolean> {
	return new Promise((resolve) => {
		communicationService.onLast(
			AdSlot.SLOT_VISIBILITY_CHANGED,
			({ payload }) => {
				console.log('refresh', payload);
				if (payload.inViewPercentage < 100) {
					resolve(true);
				}
				resolve(false);
			},
			slotName,
		);
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
	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.config.slots.includes(adSlot.getSlotName())) return;

		setTimeout(async () => {
			if (adSlot.isEnabled()) {
				this.log(`${adSlot.getSlotName()} will be refreshed.`);
				const outOfTheViewport = await isOutOfTheViewport(adSlot.getSlotName());
				if (outOfTheViewport) {
					this.log(`${adSlot.getSlotName()} waiting for being in viewport.`);
					refreshWhenBackToViewport(adSlot);
					return;
				}
				logger(logGroup, `refreshing right away ${adSlot.getSlotName()}`);
				GptProvider.refreshSlot(adSlot);
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
		this.setupSlotRefresher({ slots: ['top_boxad'], timeoutMS: 5000 }, await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
