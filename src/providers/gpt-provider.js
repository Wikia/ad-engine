import { decorate } from 'core-decorators';
import { logger, defer } from '../utils';
import { GptSizeMap } from './gpt-size-map';
import { setupGptTargeting } from './gpt-targeting';
import { slotListener } from '../listeners';
import { slotService, slotDataParamsUpdater, events } from '../services';

const logGroup = 'gpt-provider';
export const gptLazyMethod = method => function decoratedGptLazyMethod(...args) {
	return window.googletag.cmd.push(() => method.apply(this, args));
};

let definedSlots = [];
let initialized = false;

function configure() {
	const tag = window.googletag.pubads();

	tag.enableSingleRequest();
	tag.disableInitialLoad();
	tag.addEventListener('slotRenderEnded', (event) => {
		const id = event.slot.getSlotElementId();
		const slot = slotService.get(id);

		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		defer(() => slotListener.emitRenderEnded(event, slot));
	});

	tag.addEventListener('impressionViewable', (event) => {
		const id = event.slot.getSlotElementId(),
			slot = slotService.get(id);

		slotListener.emitImpressionViewable(event, slot);
	});
	window.googletag.enableServices();
}

export class GptProvider {
	constructor() {
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		this.init();
	}

	@decorate(gptLazyMethod)
	init() {
		if (initialized) {
			return;
		}

		setupGptTargeting();
		configure();
		events.on(events.PAGE_CHANGE_EVENT, (options = {}) => {
			if (!options.doNotDestroyGptSlots) {
				this.destroySlots();
			}
		});
		events.on(events.PAGE_RENDER_EVENT, () => this.updateCorrelator());
		initialized = true;
	}

	@decorate(gptLazyMethod)
	fillIn(adSlot) {
		const targeting = this.parseTargetingParams(adSlot.getTargeting());
		const sizeMap = new GptSizeMap(adSlot.getSizes());

		const gptSlot = window.googletag.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getId())
			.addService(window.googletag.pubads())
			.setCollapseEmptyDiv(true)
			.defineSizeMapping(sizeMap.build());

		this.applyTargetingParams(gptSlot, targeting);
		slotDataParamsUpdater.updateOnCreate(adSlot, targeting);

		window.googletag.display(adSlot.getId());
		definedSlots.push(gptSlot);

		if (!adSlot.isAboveTheFold()) {
			this.flush();
		}

		logger(logGroup, adSlot.getId(), 'slot added');
	}

	applyTargetingParams(gptSlot, targeting) {
		Object.keys(targeting).forEach(key => gptSlot.setTargeting(key, targeting[key]));
	}

	parseTargetingParams(targeting) {
		const result = {};

		Object.keys(targeting).forEach((key) => {
			let value = targeting[key];

			if (typeof (value) === 'function') {
				value = value();
			}
			result[key] = value;
		});

		return result;
	}

	@decorate(gptLazyMethod)
	updateCorrelator() {
		window.googletag.pubads().updateCorrelator();
	}

	@decorate(gptLazyMethod)
	flush() {
		if (definedSlots.length) {
			window.googletag.pubads().refresh(definedSlots);
			definedSlots = [];
		}
	}

	@decorate(gptLazyMethod)
	destroyGptSlots(gptSlots) {
		logger(logGroup, 'destroySlots', gptSlots);
		const success = window.googletag.destroySlots(gptSlots);

		if (!success) {
			logger(logGroup, 'destroySlots', gptSlots, 'failed');
		}

		gptSlots.forEach(slot => slotService.remove(slot.getSlotElementId()));
	}

	destroySlots(slotNames) {
		const allSlots = window.googletag.pubads().getSlots();
		const slotsToDestroy = (slotNames && slotNames.length) ? allSlots.filter((slot) => {
			// google returns array
			// - in our case it has always one element and this element is the one we are interested in
			const [positionTargeting] = slot.getTargeting('pos');

			if (!positionTargeting) {
				logger(logGroup, 'destroySlots', 'getTargeting doesn\'t return pos', positionTargeting, slot);
			} else if (slotNames.indexOf(positionTargeting) > -1) {
				return true;
			}

			return false;
		}) : allSlots;

		if (slotsToDestroy.length) {
			this.destroyGptSlots(slotsToDestroy);
		} else {
			logger(logGroup, 'destroySlots', 'no slots returned to destroy', allSlots, slotNames);
		}
	}
}
