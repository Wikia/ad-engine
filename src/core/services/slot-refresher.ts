// @ts-strict-ignore
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

interface EventPayload {
	adSlotName?: string;
	slot?: AdSlot;
}

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
	const bidGroup = context.get(`slots.${slotName}.bidGroup`);

	if (!bidGroup) {
		context.set(`slots.${slotName}.bidGroup`, slotName);
	}

	communicationService.emit(eventsRepository.BIDDERS_CALL_PER_GROUP, {
		group: slotName,
		callback: callback,
	});
}

function refreshWhenBackInViewport(adSlot: AdSlot) {
	function refresh(event) {
		if (event.inViewPercentage === 0) return;

		logger(logGroup, `${adSlot.getSlotName()} back in the viewport, refreshing.`, event);

		callBidders(adSlot.getSlotName(), () => {
			GptProvider.refreshSlot(adSlot);
		});

		window.googletag.pubads().removeEventListener('slotVisibilityChanged', refresh);
	}

	window.googletag.pubads().addEventListener('slotVisibilityChanged', refresh);
}

export class SlotRefresher {
	config: Config;
	slotsInTheViewport: Array<string> = [];

	log(...logValues) {
		logger(logGroup, ...logValues);
	}

	isSlotRefreshable(slotName: string) {
		return this.config.slots.includes(slotName);
	}

	/**
	 * Removes adSlot sizes taller than the first rendered adSlot with the same slotName.
	 * @param {AdSlot} adSlot - The ad slot to adjust.
	 */
	private removeHigherSlotSizes(adSlot: AdSlot) {
		const slotName = adSlot.getSlotName();

		const slotRefresherConfig = context.get('slotConfig.slotRefresher.sizes');
		if (!slotRefresherConfig) return;

		const slotHeightLimit = slotRefresherConfig[slotName][1];
		if (!slotHeightLimit) return;

		const filterCallback = (size) => size[1] <= slotHeightLimit && size[1] > 3;

		const sizeKey = context.get(`slots.${adSlot.getSlotName()}.sizes`);
		if (sizeKey) {
			context.set(`slots.${adSlot.getSlotName()}.sizes`, sizeKey[0].sizes.filter(filterCallback));
		}
		const defaultSizeKey = context.get(`slots.${adSlot.getSlotName()}.defaultSizes`);

		if (defaultSizeKey) {
			context.set(
				`slots.${adSlot.getSlotName()}.defaultSizes`,
				defaultSizeKey.filter(filterCallback),
			);
		}

		if (adSlot.config.sizes) {
			adSlot.config.sizes = adSlot.config.sizes.filter(filterCallback);
		}

		if (adSlot.config.defaultSizes) {
			adSlot.config.defaultSizes = adSlot.config.defaultSizes.filter(filterCallback);
		}

		communicationService.emit(eventsRepository.SLOT_REFRESHER_SET_MAXIMUM_SLOT_HEIGHT, {
			adSlot,
			filterCallback,
		});
	}

	addSlotSizeToContext(adSlot: AdSlot) {
		context.set(`slotConfig.slotRefresher.sizes.${adSlot.getSlotName()}`, [
			adSlot.getElement().clientWidth,
			adSlot.getElement().clientHeight,
		]);
	}

	refreshSlot(adSlot: AdSlot) {
		if (!this.isSlotRefreshable(adSlot.getSlotName())) return;
		const slotSizes = context.get('slotConfig.slotRefresher.sizes') || {};

		if (!(adSlot.getSlotName() in slotSizes)) {
			setTimeout(() => {
				this.addSlotSizeToContext(adSlot);
				this.removeHigherSlotSizes(adSlot);
			}, 1000);
		}

		setTimeout(() => {
			if (!adSlot.isEnabled()) return;
			this.log(`${adSlot.getSlotName()} will be refreshed.`);

			if (adSlot.refreshable) {
				this.log(`refreshing ${adSlot.getSlotName()}`);
				adSlot.updatePushTimeAfterBid();
				callBidders(adSlot.getSlotName(), () => {
					GptProvider.refreshSlot(adSlot);
				});

				return;
			}

			this.log(`${adSlot.getSlotName()} waiting for being in viewport.`);
			refreshWhenBackInViewport(adSlot);
		}, this.config.timeoutMS);
	}

	private addSlotsConfiguredToRefreshing() {
		const allSlots = slotService.slotConfigsMap;
		Object.entries(allSlots).forEach(([, slotConfiguration]) => {
			if (!slotConfiguration.slotRefreshing) return;
			this.config.slots.push(slotConfiguration.slotName);
		});
	}

	setupSlotRefresher(additionalConfig: Config, isUap: boolean, logger) {
		this.config = {
			...defaultConfig,
			...additionalConfig,
		};

		this.addSlotsConfiguredToRefreshing();

		const disabled =
			this.config.slots.length < 1 || !!context.get('services.durationMedia.enabled');
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
