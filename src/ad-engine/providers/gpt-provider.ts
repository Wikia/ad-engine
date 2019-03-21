import { decorate } from 'core-decorators';
import { slotListener } from '../listeners';
import { AdSlot, Targeting } from '../models';
import {
	btfBlockerService,
	context,
	events,
	eventService,
	slotDataParamsUpdater,
	slotService,
	trackingOptIn,
} from '../services';
import { defer, logger } from '../utils';
import { GptSizeMap } from './gpt-size-map';
import { setupGptTargeting } from './gpt-targeting';
import { Provider } from './provider';

const logGroup = 'gpt-provider';

export const ADX = 'AdX';

function postponeExecutionUntilGptLoads(method) {
	return function (...args) {
		return window.googletag.cmd.push(() => method.apply(this, args));
	};
}

let definedSlots = [];
let initialized = false;

function getAdSlotFromEvent(
	event:
		| googletag.events.ImpressionViewableEvent
		| googletag.events.SlotOnloadEvent
		| googletag.events.SlotRenderEndedEvent
		| googletag.events.slotVisibilityChangedEvent,
) {
	const id = event.slot.getSlotElementId();

	return slotService.get(id);
}

function configure() {
	const tag = window.googletag.pubads();

	tag.disableInitialLoad();

	tag.addEventListener('slotOnload', (event: googletag.events.SlotOnloadEvent) => {
		slotListener.emitLoadedEvent(event, getAdSlotFromEvent(event));
	});

	tag.addEventListener('slotRenderEnded', (event: googletag.events.SlotRenderEndedEvent) => {
		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		defer(() => slotListener.emitRenderEnded(event, getAdSlotFromEvent(event)));
	});

	tag.addEventListener('impressionViewable', (event: googletag.events.ImpressionViewableEvent) => {
		slotListener.emitImpressionViewable(event, getAdSlotFromEvent(event));
	});
	window.googletag.enableServices();
}

export class GptProvider implements Provider {
	constructor() {
		window.googletag = window.googletag || ({} as googletag.Googletag);
		window.googletag.cmd = window.googletag.cmd || [];

		this.init();
	}

	isInitialized(): boolean {
		return initialized;
	}

	@decorate(postponeExecutionUntilGptLoads)
	init(): void {
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

	setupNonPersonalizedAds(): void {
		const tag = window.googletag.pubads();

		tag.setRequestNonPersonalizedAds(trackingOptIn.isOptedIn() ? 0 : 1);
	}

	@decorate(postponeExecutionUntilGptLoads)
	fillIn(adSlot: AdSlot): void {
		const adStack = context.get('state.adStack') || [];

		btfBlockerService.push(adSlot, (...args) => {
			this.fillInCallback(...args);
		});
		if (adStack.length === 0) {
			this.flush();
		}
	}

	/** @private */
	fillInCallback(adSlot: AdSlot): void {
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
	createGptSlot(adSlot: AdSlot, sizeMap: GptSizeMap) {
		if (adSlot.isOutOfPage()) {
			return window.googletag.defineOutOfPageSlot(adSlot.getAdUnit(), adSlot.getSlotName());
		}

		return window.googletag
			.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getSlotName())
			.defineSizeMapping(sizeMap.build());
	}

	applyTargetingParams(gptSlot: googletag.Slot, targeting: Targeting) {
		Object.keys(targeting).forEach((key) => gptSlot.setTargeting(key, targeting[key]));
	}

	parseTargetingParams(targetingParams: { [key: string]: any }): Targeting {
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

		return result as Targeting;
	}

	@decorate(postponeExecutionUntilGptLoads)
	updateCorrelator(): void {
		window.googletag.pubads().updateCorrelator();
	}

	/** @private */
	flush(): void {
		if (definedSlots.length) {
			window.googletag.pubads().refresh(definedSlots, { changeCorrelator: false });
			definedSlots = [];
		}
	}

	@decorate(postponeExecutionUntilGptLoads)
	destroyGptSlots(gptSlots: googletag.Slot[]): void {
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

	destroySlots(slotNames?: string[]): boolean {
		const allSlots = window.googletag.pubads().getSlots();
		let slotsToDestroy = allSlots;

		if (slotNames && slotNames.length) {
			slotsToDestroy = allSlots.filter((slot) => {
				const slotId = slot.getSlotElementId();

				if (!slotId) {
					logger(logGroup, 'destroySlots', "slot doesn't return element id", slot);
				} else if (slotNames.indexOf(slotId) > -1) {
					return true;
				}

				return false;
			});
		}

		if (slotsToDestroy.length) {
			this.destroyGptSlots(slotsToDestroy);
			return true;
		}

		logger(logGroup, 'destroySlots', 'no slots returned to destroy', allSlots, slotNames);
		return false;
	}
}
