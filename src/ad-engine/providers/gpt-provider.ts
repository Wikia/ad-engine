import { decorate } from 'core-decorators';
import { defer, logger } from '../utils';
import { slotListener } from '../listeners';
import {
	btfBlockerService,
	context,
	events,
	eventService,
	slotDataParamsUpdater,
	slotService,
	trackingOptIn,
} from '../services';
import { GptSizeMap } from './gpt-size-map';
import { setupGptTargeting } from './gpt-targeting';

const logGroup = 'gpt-provider';

export const ADX = 'AdX';

function postponeExecutionUntilGptLoads(method) {
	return function (...args) {
		return window.googletag.cmd.push(() => method.apply(this, args));
	};
}

let definedSlots = [];
let initialized = false;

function getAdSlotFromEvent(event) {
	const id = event.slot.getSlotElementId();

	return slotService.get(id);
}

function configure() {
	const tag = window.googletag.pubads();

	if (!context.get('options.isSraDisabled')) {
		tag.enableSingleRequest();
	}
	tag.disableInitialLoad();

	tag.addEventListener('slotOnload', (event) => {
		slotListener.emitLoadedEvent(event, getAdSlotFromEvent(event));
	});

	tag.addEventListener('slotRenderEnded', (event) => {
		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		defer(() => slotListener.emitRenderEnded(event, getAdSlotFromEvent(event)));
	});

	tag.addEventListener('impressionViewable', (event) => {
		slotListener.emitImpressionViewable(event, getAdSlotFromEvent(event));
	});
	window.googletag.enableServices();
}

export class GptProvider {
	constructor(forceInit = false) {
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		this.init(forceInit);
	}

	isInitialized() {
		return initialized;
	}

	@decorate(postponeExecutionUntilGptLoads)
	init() {
		if (this.isInitialized()) {
			return;
		}

		setupGptTargeting();
		configure();
		this.setupNonPersonalizedAds();
		eventService.on(events.BEFORE_PAGE_CHANGE_EVENT, () => this.destroySlots());
		eventService.on(events.PAGE_RENDER_EVENT, () => this.updateCorrelator());
		initialized = true;
	}

	setupNonPersonalizedAds() {
		const tag = window.googletag.pubads();

		tag.setRequestNonPersonalizedAds(trackingOptIn.isOptedIn() ? 0 : 1);
	}

	@decorate(postponeExecutionUntilGptLoads)
	fillIn(adSlot) {
		const adStack = context.get('state.adStack');

		btfBlockerService.push(adSlot, (...args) => {
			this.fillInCallback(...args);
		});
		if (adStack.length === 0) {
			this.flush();
		}
	}

	/** @private */
	fillInCallback(adSlot) {
		const targeting = this.parseTargetingParams(adSlot.getTargeting());
		const sizeMap = new GptSizeMap(adSlot.getSizes());
		const gptSlot = this.createGptSlot(adSlot, sizeMap);

		gptSlot.addService(window.googletag.pubads()).setCollapseEmptyDiv(true);

		this.applyTargetingParams(gptSlot, targeting);
		slotDataParamsUpdater.updateOnCreate(adSlot, targeting);
		adSlot.updateWinningPbBidderDetails();

		window.googletag.display(adSlot.getSlotName());
		definedSlots.push(gptSlot);

		if (!adSlot.isFirstCall()) {
			this.flush();
		}

		logger(logGroup, adSlot.getSlotName(), 'slot added');
	}

	/** @private */
	createGptSlot(adSlot, sizeMap) {
		if (adSlot.isOutOfPage()) {
			return window.googletag.defineOutOfPageSlot(adSlot.getAdUnit(), adSlot.getSlotName());
		}

		return window.googletag
			.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getSlotName())
			.defineSizeMapping(sizeMap.build());
	}

	applyTargetingParams(gptSlot, targeting) {
		Object.keys(targeting).forEach((key) => gptSlot.setTargeting(key, targeting[key]));
	}

	parseTargetingParams(targetingParams) {
		const result = {};

		Object.keys(targetingParams).forEach((key) => {
			let value = targetingParams[key];

			if (typeof value === 'function') {
				value = value();
			}

			if (value !== null) {
				result[key] = value;
			}
		});

		return result;
	}

	@decorate(postponeExecutionUntilGptLoads)
	updateCorrelator() {
		window.googletag.pubads().updateCorrelator();
	}

	/** @private */
	flush() {
		if (definedSlots.length) {
			window.googletag.pubads().refresh(definedSlots, { changeCorrelator: false });
			definedSlots = [];
		}
	}

	@decorate(postponeExecutionUntilGptLoads)
	destroyGptSlots(gptSlots) {
		logger(logGroup, 'destroySlots', gptSlots);

		gptSlots.forEach((gptSlot) => {
			const adSlot = slotService.get(gptSlot.getSlotElementId());

			slotService.remove(adSlot);
		});

		const success = window.googletag.destroySlots(gptSlots);

		if (!success) {
			logger(logGroup, 'destroySlots', gptSlots, 'failed');
		}
	}

	destroySlots(slotNames) {
		const allSlots = window.googletag.pubads().getSlots();
		const slotsToDestroy =
			slotNames && slotNames.length
				? allSlots.filter((slot) => {
					const slotId = slot.getSlotElementId();

					if (!slotId) {
						logger(logGroup, 'destroySlots', "slot doesn't return element id", slot);
					} else if (slotNames.indexOf(slotId) > -1) {
						return true;
					}

					return false;
				  })
				: allSlots;

		if (slotsToDestroy.length) {
			this.destroyGptSlots(slotsToDestroy);
		} else {
			logger(logGroup, 'destroySlots', 'no slots returned to destroy', allSlots, slotNames);
		}
	}
}
