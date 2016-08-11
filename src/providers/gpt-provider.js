/* global googletag */

'use strict';

import {logger} from '../utils/logger';
import {makeLazyQueue} from '../utils/lazy-queue';
import {setupGptTargeting} from './gpt-targeting';
import SlotListener from './../listeners/slot-listener';
import SlotService from './../services/slot-service';

let atfEnded = false,
	definedSlots = [],
	initialized = false,
	logGroup = 'gpt-provider',
	slotsQueue = [];

function finishAtf() {
	atfEnded = true;
	if (window.ads.runtime.disableBtf) {
		SlotService.forEach((adSlot) => {
			if (!adSlot.isAboveTheFold()) {
				SlotService.disable(adSlot.getSlotName());
			}
		});
	}
	slotsQueue.start();
}

function configure() {
	const tag = googletag.pubads();

	tag.enableSingleRequest();
	tag.disableInitialLoad();
	tag.addEventListener('slotRenderEnded', (event) => {
		let id = event.slot.getSlotElementId(),
			slot = SlotService.get(id);

		if (!atfEnded && slot.isAboveTheFold()) {
			finishAtf();
		}

		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		setTimeout(() => {
			SlotListener.onRenderEnded(event, slot);
		}, 0);
	});
	googletag.enableServices();
}

function shouldPush(adSlot) {
	if (!atfEnded && !adSlot.isAboveTheFold()) {
		slotsQueue.push(adSlot);
		logger(logGroup, adSlot.getId(), 'BTF slot pushed to queue');
		return false;
	}

	if (atfEnded && !adSlot.isEnabled()) {
		logger(logGroup, adSlot.getId(), 'BTF slot blocked');
		return false;
	}

	return true;
}

export default class Gpt {
	/**
	 * Create new instance
	 */
	constructor() {
		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		googletag.cmd.push(() => {
			this.init();
		});
	}

	/**
	 * Configure googletag and setup targeting
	 */
	init() {
		if (initialized) {
			return;
		}

		setupGptTargeting();
		configure();
		makeLazyQueue(slotsQueue, (adSlot) => {
			this.fillIn(adSlot);
		});
		initialized = true;
	}

	/**
	 * Fill in slot
	 *
	 * @param {object} adSlot
	 */
	fillIn(adSlot) {
		if (!shouldPush(adSlot)) {
			return;
		}

		googletag.cmd.push(() => {
			let gptSlot,
				sizeMapping,
				targeting = adSlot.getTargeting();

			sizeMapping = googletag.sizeMapping();
			adSlot.getSizes().forEach((item) => {
				sizeMapping.addSize(item.viewportSize, item.sizes);
			});

			if (adSlot.isOutOfPage()) {
				gptSlot = googletag.defineOutOfPageSlot(adSlot.getAdUnit(), adSlot.getId());
			} else if (adSlot.getDefaultSizes()) {
				gptSlot = googletag.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getId())
			} else {
				throw 'Can\'t add slot - define default sizes or declare as out-of-page';
			}

			gptSlot.addService(googletag.pubads())
				.setCollapseEmptyDiv(true)
				.defineSizeMapping(sizeMapping.build())
				.setTargeting('pos', adSlot.getSlotName())
				.setTargeting('src', 'gpt');

			Object.keys(targeting).forEach((key) => {
				gptSlot.setTargeting(key, targeting[key]);
			});

			googletag.display(adSlot.getId());
			definedSlots.push(gptSlot);

			if (atfEnded) {
				this.flush();
			}

			logger(logGroup, adSlot.getId(), 'slot added');
		});
	}

	/**
	 * Flush defined slots
	 */
	flush() {
		googletag.cmd.push(() => {
			if (definedSlots.length) {
				googletag.pubads().refresh(definedSlots);
				definedSlots = [];
			}
		});
	}
}
