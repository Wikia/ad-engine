import { communicationService, eventsRepository } from '@ad-engine/communication';
import { decorate } from 'core-decorators';
import { getAdStack } from '../ad-engine';
import { utils } from '../index';
import { AdSlot, Dictionary } from '../models';
import {
	btfBlockerService,
	config,
	context,
	slotDataParamsUpdater,
	slotService,
	SlotTargeting,
	TargetingData,
	targetingService,
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
const AllViewportSizes = [0, 0];

export function postponeExecutionUntilGptLoads(method: () => void): any {
	return function (...args: any): void {
		setTimeout(() => {
			window.googletag = window.googletag || ({} as googletag.Googletag);
			window.googletag.cmd = window.googletag.cmd || [];

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
): AdSlot | null {
	const id = event.slot.getSlotElementId();

	return slotService.get(id);
}

function configure(): void {
	const tag = window.googletag.pubads();

	tag.disableInitialLoad();

	tag.addEventListener('slotRequested', (event: googletag.events.SlotRequestedEvent) => {
		const adSlot = getAdSlotFromEvent(event);
		adSlot.setStatus(AdSlot.STATUS_REQUESTED);
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

			adjustIframeSize(adSlot);

			return adSlot.emit(AdSlot.SLOT_RENDERED_EVENT, { event, adType }, false);
		});
	});

	tag.addEventListener('impressionViewable', (event: googletag.events.ImpressionViewableEvent) => {
		const adSlot = getAdSlotFromEvent(event);

		adSlot.emit(AdSlot.SLOT_VIEWED_EVENT);
	});

	tag.addEventListener(
		'slotVisibilityChanged',
		function (event: googletag.events.SlotVisibilityChangedEvent) {
			const adSlot = getAdSlotFromEvent(event);

			return adSlot.emit(AdSlot.SLOT_VISIBILITY_CHANGED, event);
		},
	);

	tag.addEventListener(
		'slotVisibilityChanged',
		function (event: googletag.events.SlotVisibilityChangedEvent) {
			const adSlot = getAdSlotFromEvent(event);

			if (event.inViewPercentage > 50) {
				return adSlot.emit(AdSlot.SLOT_BACK_TO_VIEWPORT, event);
			}
		},
	);

	tag.addEventListener(
		'slotVisibilityChanged',
		function (event: googletag.events.SlotVisibilityChangedEvent) {
			const adSlot = getAdSlotFromEvent(event);

			if (event.inViewPercentage < 50) {
				return adSlot.emit(AdSlot.SLOT_LEFT_VIEWPORT, event);
			}
		},
	);

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

function adjustIframeSize(adSlot: AdSlot): void {
	const sizeMap = context.get('templates.sizeOverwritingMap');
	const iframe = adSlot.getIframe();

	if (!sizeMap || !iframe) {
		return;
	}

	const iframeSize = `${iframe.width}x${iframe.height}`;

	if (sizeMap[iframeSize]) {
		iframe.width = sizeMap[iframeSize].originalSize[0].toString();
		iframe.height = sizeMap[iframeSize].originalSize[1].toString();
	}
}

function SmLogger(targeting: SlotTargeting) {
	const isTlb =
		(targeting.pos.constructor == Array && targeting.pos[0] == 'top_leaderboard') ||
		targeting.pos == 'top_leaderboard';
	const smLoggerLoaded =
		window['smTracking'] !== undefined && window['smTracking'].recordRequestTargeting;

	if (isTlb && smLoggerLoaded) {
		window['smTracking'].recordRequestTargeting(targeting);
	}
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
		this.setupRestrictDataProcessing();
		this.setPPID();
		communicationService.on(
			eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE,
			() => this.updateCorrelator(),
			false,
		);
		communicationService.onSlotEvent(AdSlot.DESTROYED_EVENT, ({ slot }) => {
			this.destroySlot(slot.getSlotName());
		});
		initialized = true;
	}

	setupRestrictDataProcessing(): void {
		const tag = window.googletag.pubads();
		const settings: Dictionary = {
			restrictDataProcessing: trackingOptIn.isOptOutSale(),
		};

		if (config.rollout.coppaFlag().gam && utils.targeting.isWikiDirectedAtChildren()) {
			settings.childDirectedTreatment = true;
		}

		tag.setPrivacySettings(settings);
	}

	setPPID() {
		const ppid = targetingService.dump<TargetingData>().ppid;
		if (ppid) {
			const tag = window.googletag.pubads();
			tag.setPublisherProvidedId(ppid);
		}
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
		const adSlotName = adSlot.getSlotName();
		const targeting = adSlot.getTargeting();
		const sizeMap = new GptSizeMap(adSlot.getSizes());
		const gptSlot = this.createGptSlot(adSlot, sizeMap);

		gptSlot.addService(window.googletag.pubads()).setCollapseEmptyDiv(true);

		this.applyTargetingParams(gptSlot, targeting);

		slotDataParamsUpdater.updateOnCreate(adSlot);
		adSlot.updateWinningPbBidderDetails();

		window.googletag.display(adSlotName);
		definedSlots.push(gptSlot);

		if (!adSlot.isFirstCall()) {
			this.flush();
		}

		logger(logGroup, adSlotName, 'slot added');
	}

	/** @private */
	createGptSlot(adSlot: AdSlot, sizeMap: GptSizeMap): googletag.Slot {
		if (adSlot.isOutOfPage()) {
			if (adSlot.getConfigProperty('outOfPageFormat')) {
				return window.googletag.defineOutOfPageSlot(
					adSlot.getAdUnit(),
					// @ts-ignore for some reason our @types/doubleclick-gpt/index.d.ts don't have enums maybe after TS update
					window.googletag.enums.OutOfPageFormat[adSlot.getConfigProperty('outOfPageFormat')],
				);
			}

			return window.googletag.defineOutOfPageSlot(adSlot.getAdUnit(), adSlot.getSlotName());
		}

		return window.googletag
			.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getSlotName())
			.defineSizeMapping(sizeMap.build());
	}

	applyTargetingParams(gptSlot: googletag.Slot, targeting: SlotTargeting): void {
		SmLogger(targeting);

		Object.keys(targeting).forEach((key) => {
			let value = targeting[key];

			value = Array.isArray(value) ? value.map((item) => item.toString()) : value.toString();

			gptSlot.setTargeting(key, value);
		});
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

	static refreshSlot(adSlot: AdSlot): void {
		const activeSlots = window.googletag.pubads().getSlots();
		const gptSlot = activeSlots.find((slot) => slot.getSlotElementId() === adSlot.getSlotName());
		gptSlot.clearTargeting();
		const mapping = window.googletag
			.sizeMapping()
			.addSize(AllViewportSizes, adSlot.getCreativeSizeAsArray())
			.build();
		gptSlot.defineSizeMapping(mapping);
		window.googletag.pubads().refresh([gptSlot]);
	}
}
