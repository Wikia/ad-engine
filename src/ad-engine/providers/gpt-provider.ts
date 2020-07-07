import { decorate } from 'core-decorators';
// tslint:disable-next-line:no-blacklisted-paths
import { getAdStack } from '../ad-engine';
import { AdSlot, Dictionary, Targeting } from '../models';
import {
	btfBlockerService,
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
export const GAMOrigins: string[] = [
	'https://tpc.googlesyndication.com',
	'https://googleads.g.doubleclick.net',
];

export function postponeExecutionUntilGptLoads(method: () => void) {
	return function (...args: any) {
		// TODO: remove this hack in https://wikia-inc.atlassian.net/browse/ADEN-9254
		setTimeout(() => {
			return window.googletag.cmd.push(() => method.apply(this, args));
		});
	};
}

let definedSlots: googletag.Slot[] = [];
let initialized = false;

function getAdSlotFromEvent(
	event:
		| googletag.events.ImpressionViewableEvent
		| googletag.events.SlotOnloadEvent
		| googletag.events.SlotRenderEndedEvent,
) {
	const id = event.slot.getSlotElementId();

	return slotService.get(id);
}

function configure() {
	const tag = window.googletag.pubads();

	tag.disableInitialLoad();

	tag.addEventListener('slotRequested', (event: googletag.events.SlotRequestedEvent) => {
		const adSlot = getAdSlotFromEvent(event);

		adSlot.emit(AdSlot.SLOT_REQUESTED_EVENT);
	});

	tag.addEventListener('slotOnload', (event: googletag.events.SlotOnloadEvent) => {
		const adSlot = getAdSlotFromEvent(event);

		adSlot.emit(AdSlot.SLOT_LOADED_EVENT);
	});

	tag.addEventListener('slotRenderEnded', (event: googletag.events.SlotRenderEndedEvent) => {
		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		defer(() => {
			const adSlot = getAdSlotFromEvent(event);
			const adType = getAdType(event, adSlot.getIframe());

			return adSlot.emit(AdSlot.SLOT_RENDERED_EVENT, event, adType);
		});
	});

	tag.addEventListener('impressionViewable', (event: googletag.events.ImpressionViewableEvent) => {
		const adSlot = getAdSlotFromEvent(event);

		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
	});

	window.googletag.enableServices();
}

function getAdType(
	event: googletag.events.SlotRenderEndedEvent,
	iframe: HTMLIFrameElement | null,
): string {
	let isIframeAccessible = false;

	if (event.isEmpty) {
		return AdSlot.STATUS_COLLAPSE;
	}

	try {
		isIframeAccessible = !!iframe.contentWindow.document.querySelector;
	} catch (e) {
		logger(logGroup, 'getAdType', 'iframe is not accessible');
	}

	if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
		return iframe.contentWindow.AdEngine_adType;
	}

	return AdSlot.STATUS_SUCCESS;
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
		this.setupRestrictDataProcessing();
		eventService.on(events.PAGE_RENDER_EVENT, () => this.updateCorrelator());
		eventService.on(AdSlot.DESTROYED_EVENT, (adSlot: AdSlot) => {
			this.destroySlot(adSlot.getSlotName());
		});
		initialized = true;
	}

	setupNonPersonalizedAds(): void {
		const tag = window.googletag.pubads();

		tag.setRequestNonPersonalizedAds(trackingOptIn.isOptedIn() ? 0 : 1);
	}

	setupRestrictDataProcessing(): void {
		const tag = window.googletag.pubads();

		tag.setPrivacySettings({
			restrictDataProcessing: trackingOptIn.isOptOutSale(),
		});
	}

	@decorate(postponeExecutionUntilGptLoads)
	fillIn(adSlot: AdSlot): void {
		const adStack = getAdStack() || [];

		btfBlockerService.push(adSlot, (...args) => {
			this.fillInCallback(...args);
		});
		if (adStack.length === 0) {
			this.flush();
		}
	}

	private fillInCallback(adSlot: AdSlot): void {
		const targeting = adSlot.getTargeting();
		const sizeMap = new GptSizeMap(adSlot.getSizes());
		const gptSlot = this.createGptSlot(adSlot, sizeMap);

		gptSlot.addService(window.googletag.pubads()).setCollapseEmptyDiv(true);

		this.applyTargetingParams(gptSlot, targeting);

		if (adSlot.getConfigProperty('forceSafeFrame')) {
			this.forceSafeFrame(gptSlot);
		}

		slotDataParamsUpdater.updateOnCreate(adSlot);
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
		Object.keys(targeting).forEach((key) => {
			let value = targeting[key];

			if (Array.isArray(value)) {
				value = value.map((item) => item.toString());
			} else {
				value = value.toString();
			}
			gptSlot.setTargeting(key, value);
		});
	}

	forceSafeFrame(gptSlot: googletag.Slot) {
		gptSlot.setForceSafeFrame(true);
		gptSlot.setSafeFrameConfig({
			sandbox: true,
		});
	}

	parseTargetingParams(targetingParams: Dictionary): Targeting {
		const result: Dictionary = {};

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

	private flush(): void {
		if (definedSlots.length) {
			window.googletag.pubads().refresh(definedSlots, { changeCorrelator: false });
			definedSlots = [];
		}
	}

	private destroySlot(slotName: string): boolean {
		const allSlots = window.googletag.pubads().getSlots();
		const slotToDestroy = allSlots.find((gptSlot) => slotName === gptSlot.getSlotElementId());

		if (slotToDestroy) {
			this.destroyGptSlot(slotToDestroy);

			return true;
		}

		logger(logGroup, 'destroySlot', "slot doesn't return element id", slotName);

		return false;
	}

	@decorate(postponeExecutionUntilGptLoads)
	private destroyGptSlot(gptSlot: googletag.Slot): void {
		logger(logGroup, 'destroySlot', gptSlot);

		const success = window.googletag.destroySlots([gptSlot]);

		if (!success) {
			logger(logGroup, 'destroySlot', gptSlot, 'failed');
		}
	}
}
