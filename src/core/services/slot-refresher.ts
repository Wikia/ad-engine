import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot, AdSlotEvent, AdSlotStatus } from '../models';
import { GptProvider } from '../providers';
import { logger } from '../utils';
import { context } from './context-service';
import { slotService } from './slot-service';

const logGroup = 'slot-refresher';

interface Config {
	timeoutMS?: number;
	slots?: string[];
}

type EventPayload = Partial<{ adSlotName: string; slot: AdSlot }>;

const defaultConfig: Config = {
	timeoutMS: 28_000,
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

function callBidders(slotName: string, callback: () => void) {
	context.set(`slots.${slotName}.bidGroup`, slotName);

	communicationService.emit(eventsRepository.BIDDERS_CALL_PER_GROUP, {
		group: slotName,
		callback: callback,
	});
}

function refreshWhenBackInViewport(adSlot: AdSlot) {
	function refresh(event) {
		if (event.slot.getSlotElementId() === adSlot.getSlotName()) {
			logger(logGroup, `${adSlot.getSlotName()} back in the viewport, refreshing.`, event);

			callBidders(adSlot.getSlotName(), () => {
				setTimeout(() => {
					GptProvider.refreshSlot(adSlot);
				}, 2000);
			});

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

	isSlotRefreshable(slotName: string) {
		return this.config.slots.includes(slotName);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.isSlotRefreshable(adSlot.getSlotName())) return;

		setTimeout(() => {
			if (adSlot.isEnabled()) {
				this.log(`${adSlot.getSlotName()} will be refreshed.`);

				if (this.slotsInTheViewport.includes(adSlot.getSlotName())) {
					this.log(`refreshing ${adSlot.getSlotName()}`);

					callBidders(adSlot.getSlotName(), () => {
						setTimeout(() => {
							GptProvider.refreshSlot(adSlot);
						}, 2000);
					});

					return;
				}

				this.log(`${adSlot.getSlotName()} waiting for being in viewport.`);
				refreshWhenBackInViewport(adSlot);
			}
		}, this.config.timeoutMS);
	}

	private addSlotsConfiguredToRefreshing() {
		const allSlots = slotService.slotConfigsMap;
		Object.entries(allSlots).forEach(([, slotConfiguration]) => {
			if (slotConfiguration.slotRefreshing) {
				this.config.slots.push(slotConfiguration.slotName);
			}
		});
	}

	setupSlotRefresher(additionalConfig: Config, isUap: boolean, logger) {
		this.config = {
			...defaultConfig,
			...additionalConfig,
		};

		this.addSlotsConfiguredToRefreshing();

		const disabled = this.config.slots.length < 1;

		if (disabled || isUap) {
			logger('disabled');
			return;
		}

		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_VIEWED_EVENT,
			({ adSlotName, slot }: EventPayload) => {
				if (!this.isSlotRefreshable(adSlotName)) return;

				logger(`${adSlotName} viewed`);
				this.refreshSlot(slot);
			},
		);

		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_COLLAPSE,
			({ adSlotName }: EventPayload) => {
				if (!this.isSlotRefreshable(adSlotName)) return;

				logger(`${adSlotName} collapse`);
			},
		);

		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_BACK_TO_VIEWPORT,
			({ adSlotName }: EventPayload) => {
				if (!this.isSlotRefreshable(adSlotName)) return;

				this.slotsInTheViewport.push(adSlotName);
			},
		);

		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_LEFT_VIEWPORT,
			({ adSlotName }: EventPayload) => {
				if (!this.isSlotRefreshable(adSlotName)) return;
				this.slotsInTheViewport = this.slotsInTheViewport.filter(
					(slotName) => slotName !== adSlotName,
				);
			},
		);

		logger('enabled', this.config);
	}

	async init() {
		this.setupSlotRefresher(context.get('services.slotRefresher.config'), await isUAP(), this.log);
	}
}

export const slotRefresher = new SlotRefresher();
