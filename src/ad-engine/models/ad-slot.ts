import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	AdStackPayload,
	insertMethodType,
	SlotPlaceholderContextConfig,
	slotTweaker,
	utils,
} from '../';
import { ADX, GptSizeMapping } from '../providers';
import { context, slotDataParamsUpdater, templateService } from '../services';
import { AD_LABEL_CLASS, getTopOffset, logger, stringBuilder } from '../utils';
import { Dictionary } from './dictionary';

export interface Targeting {
	amznbid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	src?: string;
	pos?: string;
	loc?: string;
	rv?: number;
	[key: string]: googletag.NamedSize | number;
}

export interface RepeatConfig {
	index: number;
	slotNamePattern: string;
	limit: number;
	updateProperties: Dictionary;
	additionalClasses?: string;
	disablePushOnScroll?: boolean;
	insertBelowScrollPosition?: boolean;
}

export interface SlotConfig {
	uid: string;
	adProduct: string;
	bidderAlias: string;
	disabled?: boolean;
	disableExpandAnimation?: boolean;
	initStage?: boolean;
	firstCall?: boolean;
	aboveTheFold?: boolean;
	slotName?: string;
	slotNameSuffix: string;
	insertBeforeSelector?: string;
	insertAfterSelector?: string;
	parentContainerSelector?: string;
	insertIntoParentContainerMethod?: insertMethodType;

	targeting: Targeting;
	videoAdUnit?: string;
	repeat?: RepeatConfig;
	adUnit?: string;
	sizes?: GptSizeMapping[];
	videoSizes?: number[][];
	defaultSizes?: any;
	viewportConflicts?: string[];
	insertBelowFirstViewport?: boolean;
	avoidConflictWith?: string;
	outOfPage?: any;
	isVideo?: boolean;

	trackingKey?: string;
	audio?: boolean;
	autoplay?: boolean;
	placeholder?: SlotPlaceholderContextConfig;
	videoDepth?: number;
}

export interface WinningBidderDetails {
	name: string;
	price: number | string;
}

export class AdSlot {
	static CUSTOM_EVENT = 'customEvent';
	static SLOT_ADDED_EVENT = 'slotAdded';
	static SLOT_REQUESTED_EVENT = 'slotRequested';
	static SLOT_LOADED_EVENT = 'slotLoaded';
	static SLOT_VIEWED_EVENT = 'slotViewed';
	static SLOT_RENDERED_EVENT = 'slotRendered';
	static SLOT_VISIBILITY_CHANGED = 'slotVisibilityChanged';
	static SLOT_BACK_TO_VIEWPORT = 'slotBackToViewport';
	static SLOT_LEFT_VIEWPORT = 'slotLeftViewport';
	static SLOT_STATUS_CHANGED = 'slotStatusChanged';
	static DESTROYED_EVENT = 'slotDestroyed';
	static HIDDEN_EVENT = 'slotHidden';
	static SHOWED_EVENT = 'slotShowed';

	static VIDEO_VIEWED_EVENT = 'videoViewed';
	static VIDEO_AD_REQUESTED = 'videoAdRequested';
	static VIDEO_AD_ERROR = 'videoAdError';
	static VIDEO_AD_IMPRESSION = 'videoAdImpression';
	static VIDEO_AD_USED = 'videoAdUsed';

	static LOG_GROUP = 'AdSlot';

	static STATUS_BLOCKED = 'blocked';
	static STATUS_COLLAPSE = 'collapse';
	static STATUS_DISABLED = 'disabled';
	static STATUS_FORCED_COLLAPSE = 'forced_collapse';
	static STATUS_FORCED_SUCCESS = 'forced_success';
	static STATUS_MANUAL = 'manual';
	static STATUS_REQUESTED = 'requested';
	static STATUS_ERROR = 'error';
	static STATUS_SUCCESS = 'success';
	static STATUS_CLICKED = 'clicked';
	static STATUS_VIEWPORT_CONFLICT = 'viewport-conflict';
	static STATUS_HIVI_COLLAPSE = 'hivi-collapse';
	static STATUS_CLOSED_BY_PORVATA = 'closed-by-porvata';
	static STATUS_CLOSED_BY_INTERSTITIAL = 'closed-by-interstitial';
	static STATUS_HEAVY_AD_INTERVENTION = 'heavy-ad-intervention';
	static STATUS_UNKNOWN_INTERVENTION = 'unknown-intervention';

	static AD_CLASS = 'gpt-ad';
	static AD_SLOT_PLACEHOLDER_CLASS = 'ad-slot-placeholder';
	static HIDDEN_CLASS = 'hide';

	static TEMPLATES_LOADED = 'Templates Loaded';

	private customIframe: HTMLIFrameElement = null;

	config: SlotConfig;
	element: null | HTMLElement = null;
	status: null | string = null;
	isEmpty = true;
	pushTime: number;
	enabled: boolean;
	adUnit: string;
	advertiserId: null | string = null;
	orderId: null | string | number = null;
	creativeId: null | string | number = null;
	creativeSize: null | string | number[] = null;
	lineItemId: null | string | number = null;
	winningBidderDetails: null | WinningBidderDetails = null;
	trackStatusAfterRendered = false;
	slotViewed = false;

	requested: Promise<void> = null;
	loaded: Promise<void> = null;
	rendered: Promise<void> = null;
	viewed: Promise<void> = null;

	constructor(ad: AdStackPayload) {
		this.config = context.get(`slots.${ad.id}`) || {};
		this.enabled = !this.config.disabled;

		if (!this.config.uid) {
			context.set(`slots.${ad.id}.uid`, utils.generateUniqueId());
		}

		this.config.slotName = this.config.slotName || ad.id;
		this.config.slotNameSuffix = this.config.slotNameSuffix || '';
		this.config.targeting = this.config.targeting || ({} as Targeting);
		this.config.targeting.src = this.config.targeting.src || context.get('src');
		this.config.targeting.pos = this.config.targeting.pos || this.getSlotName();

		this.requested = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlot.SLOT_REQUESTED_EVENT,
				() => {
					this.pushTime = new Date().getTime();

					resolve();
				},
				this.getSlotName(),
			);
		});
		this.loaded = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlot.SLOT_LOADED_EVENT,
				() => {
					slotTweaker.setDataParam(this, 'slotLoaded', true);

					resolve();
				},
				this.getSlotName(),
			);
		});
		this.rendered = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlot.SLOT_RENDERED_EVENT,
				({ payload }) => {
					const {
						event,
						adType,
					}: { event: googletag.events.SlotRenderEndedEvent; adType: string } = payload;

					this.setupSizesTracking(adType);
					this.updateOnRenderEnd(event, adType);

					resolve();
				},
				this.getSlotName(),
			);
		});
		this.viewed = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlot.SLOT_VIEWED_EVENT,
				() => {
					slotTweaker.setDataParam(this, 'slotViewed', true);

					resolve();
				},
				this.getSlotName(),
			);
		}).then(() => {
			this.slotViewed = true;
		});

		this.addClass(AdSlot.AD_CLASS);
		if (!this.enabled) {
			this.hide();
		}
	}

	private logger = (...args: any[]) => logger(AdSlot.LOG_GROUP, ...args);

	getAdUnit(): string {
		if (!this.adUnit) {
			this.adUnit = stringBuilder.build(this.config.adUnit || context.get('adUnitId'), {
				slotConfig: this.config,
			});
		}

		return this.adUnit;
	}

	getVideoAdUnit(): string {
		return stringBuilder.build(this.config.videoAdUnit || context.get('vast.adUnitId'), {
			slotConfig: this.config,
		});
	}

	getElement(): HTMLElement | null {
		if (!this.element) {
			this.element = document.getElementById(this.getSlotName());
		}

		return this.element;
	}

	getPlaceholder(): HTMLElement | null {
		const placeholder = this.getElement()?.parentElement;

		return placeholder?.classList.contains(AdSlot.AD_SLOT_PLACEHOLDER_CLASS) ? placeholder : null;
	}

	getAdLabel(adLabelParentSelector?: string): HTMLElement | null {
		if (adLabelParentSelector) {
			const adLabelParent: HTMLElement = document.querySelector(adLabelParentSelector);
			return adLabelParent?.querySelector(`.${AD_LABEL_CLASS}`);
		}

		return this.getPlaceholder()?.querySelector(`.${AD_LABEL_CLASS}`);
	}

	getAdContainer(): HTMLDivElement | null {
		const element = this.getElement();

		if (!element) {
			return null;
		}

		return element.querySelector<HTMLDivElement>('div[id*="_container_"]');
	}

	getIframe(): HTMLIFrameElement | null {
		const element = this.getElement();

		if (!element) {
			return null;
		}

		if (this.customIframe) {
			return this.customIframe;
		}

		return element.querySelector<HTMLIFrameElement>('div[id*="_container_"] iframe');
	}

	overrideIframe(iframe: HTMLIFrameElement): void {
		this.customIframe = iframe;
	}

	getFrameType(): 'safe' | 'regular' | null {
		const iframe = this.getIframe();

		if (!iframe) {
			return null;
		}

		return iframe.dataset.isSafeframe === 'true' ? 'safe' : 'regular';
	}

	getCreativeSize(): string | null {
		return Array.isArray(this.creativeSize) ? this.creativeSize.join('x') : this.creativeSize;
	}

	getCreativeSizeAsArray(): [number, number] | null {
		if (!this.creativeSize) return null;

		const size = Array.isArray(this.creativeSize)
			? this.creativeSize
			: this.creativeSize.split('x').map(Number);

		// Type hack to make sure it will always return two element array
		return [size[0], size[1]];
	}

	// Main position is the first value defined in the "pos" key-value (targeting)
	getMainPositionName(): string {
		const { pos = '' } = this.targeting;

		return (Array.isArray(pos) ? pos : pos.split(','))[0].toLowerCase();
	}

	getUid(): string {
		return this.config.uid;
	}

	getSlotName(): string {
		return this.config.slotName;
	}

	getSizes(): GptSizeMapping[] {
		return this.config.sizes;
	}

	/**
	 * Convenient property to get targeting.
	 * @returns {Object}
	 */
	get targeting(): Targeting {
		return this.config.targeting;
	}

	getTargeting(): Targeting {
		return this.parseTargetingParams(this.config.targeting);
	}

	private parseTargetingParams(targetingParams: Dictionary): Targeting {
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

	getDefaultSizes(): number[][] {
		return this.config.defaultSizes;
	}

	getVideoSizes(): number[][] {
		return this.config.videoSizes;
	}

	getViewportConflicts(): string[] {
		return this.config.viewportConflicts || [];
	}

	hasDefinedViewportConflicts(): boolean {
		return this.getViewportConflicts().length > 0;
	}

	getStatus(): string {
		return this.status;
	}

	getPushTime(): number {
		return this.pushTime;
	}

	setStatus(status: null | string = null): void {
		this.status = status;
		if (status !== null) {
			this.emit(status);

			slotTweaker.setDataParam(this, 'slotResult', this.getStatus());
			this.emit(AdSlot.SLOT_STATUS_CHANGED);
		}
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	isInitStage(): boolean {
		return !!this.config.initStage;
	}

	isFirstCall(): boolean {
		return !!this.config.firstCall;
	}

	isViewed(): boolean {
		return this.slotViewed;
	}

	isRepeatable(): boolean {
		return !!this.config.repeat;
	}

	isOutOfPage(): boolean {
		return !!this.config.outOfPage;
	}

	isVideo(): boolean {
		return !!this.config.isVideo;
	}

	getCopy(): SlotConfig {
		return JSON.parse(JSON.stringify(this.config));
	}

	/**
	 * Returns offset of slot from top of the page.
	 *
	 * Returns null if slot has no element.
	 */
	getTopOffset(): number | null {
		const element = this.getElement();

		return element ? getTopOffset(element) : null;
	}

	enable(): void {
		this.enabled = true;
	}

	disable(status: null | string = null): void {
		this.enabled = false;
		this.setStatus(status);
		this.hide();
	}

	destroy(): void {
		this.disable();
		this.emit(AdSlot.DESTROYED_EVENT);
	}

	getConfigProperty(key: string): any {
		return context.get(`slots.${this.config.slotName}.${key}`);
	}

	setConfigProperty(key: string, value: any): void {
		context.set(`slots.${this.config.slotName}.${key}`, value);
	}

	success(status: string = AdSlot.STATUS_SUCCESS): void {
		if (!this.getConfigProperty('showManually')) {
			this.show();
		}
		this.setStatus(status);

		const templateNames = this.getConfigProperty('defaultTemplates') || [];

		if (templateNames && templateNames.length) {
			templateNames.forEach((templateName: string) => templateService.init(templateName, this));
		}

		this.emit(AdSlot.TEMPLATES_LOADED, templateNames);

		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_LOADED, {
			name: this.getSlotName(),
			state: AdSlot.STATUS_SUCCESS,
		});
	}

	collapse(status: string = AdSlot.STATUS_COLLAPSE): void {
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_LOADED, {
			name: this.getSlotName(),
			state: AdSlot.STATUS_COLLAPSE,
		});

		this.hide();
		this.setStatus(status);
	}

	updateWinningPbBidderDetails(): void {
		if (this.targeting.hb_bidder && this.targeting.hb_pb) {
			this.winningBidderDetails = {
				name: this.targeting.hb_bidder,
				price: this.targeting.hb_pb,
			};
		} else {
			this.winningBidderDetails = null;
		}
	}

	updateWinningA9BidderDetails(): void {
		if (this.targeting.amznbid) {
			this.winningBidderDetails = {
				name: 'a9',
				price: this.targeting.amznbid,
			};
		} else {
			this.winningBidderDetails = null;
		}
	}

	private updateOnRenderEnd(event: googletag.events.SlotRenderEndedEvent, adType: string): void {
		if (!event) {
			return;
		}

		let creativeId: string | number = event.creativeId;
		let lineItemId: string | number = event.lineItemId;

		this.isEmpty = event.isEmpty;

		if (!event.isEmpty && event.slot) {
			const resp = event.slot.getResponseInformation();

			if (resp) {
				this.orderId = resp.campaignId;
				this.advertiserId = resp.advertiserId;
				if (event.sourceAgnosticCreativeId && event.sourceAgnosticLineItemId) {
					this.logger('set line item and creative id to source agnostic values');
					creativeId = event.sourceAgnosticCreativeId;
					lineItemId = event.sourceAgnosticLineItemId;
				} else if (resp.creativeId === null && resp.lineItemId === null) {
					creativeId = ADX;
					lineItemId = ADX;
				}
			}
		}

		this.creativeId = creativeId;
		this.lineItemId = lineItemId;
		this.creativeSize = this.isOutOfPage() ? 'out-of-page' : event.size;

		slotDataParamsUpdater.updateOnRenderEnd(this);

		switch (adType) {
			case AdSlot.STATUS_COLLAPSE:
			case AdSlot.STATUS_FORCED_COLLAPSE:
				this.collapse(adType);
				break;
			case AdSlot.STATUS_MANUAL:
				this.setStatus(adType);
				break;
			default:
				this.success();
		}
	}

	/**
	 * Appends class to adSlot node.
	 */
	addClass(className: string): boolean {
		const container = this.getElement();

		if (container) {
			container.classList.add(className);

			return true;
		}

		return false;
	}

	/**
	 * Removes class from adSlot node.
	 */
	removeClass(className: string): boolean {
		const container = this.getElement();

		if (container) {
			container.classList.remove(className);

			return true;
		}

		return false;
	}

	/**
	 * Hides adSlot.
	 *
	 * Adds class AdSlot.HIDDEN_CLASS to adSlot's element.
	 */
	hide(): void {
		const added = this.addClass(AdSlot.HIDDEN_CLASS);

		if (added) {
			this.emit(AdSlot.HIDDEN_EVENT);
		}
	}

	/**
	 * Shows adSlot.
	 *
	 * Removes class AdSlot.HIDDEN_CLASS from adSlot's element.
	 */
	show(): void {
		const removed = this.removeClass(AdSlot.HIDDEN_CLASS);

		if (removed) {
			this.emit(AdSlot.SHOWED_EVENT);
		}
	}

	/**
	 * Pass all events to Post-QueCast
	 */
	emit(event: string | symbol, data: any = {}, serialize = true): void {
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_EVENT, {
			event: event.toString(),
			slot: this,
			adSlotName: this.getSlotName(),
			payload: serialize ? JSON.parse(JSON.stringify(data)) : data,
		});

		this.logger(this.getSlotName(), event, data);
	}

	emitEvent(eventName: null | string = null): void {
		if (eventName !== null) {
			this.emit(AdSlot.CUSTOM_EVENT, { status: eventName });
		}
	}

	/**
	 * Return names of slots which should be injected into DOM
	 * and pushed into ad stack queue after slot is created.
	 */
	getSlotsToPushAfterCreated(): string[] {
		return context.get(`events.pushAfterCreated.${this.getSlotName()}`) || [];
	}

	/**
	 * Return names of slots which should be injected into DOM
	 * after slot is rendered.
	 */
	getSlotsToInjectAfterRendered(): string[] {
		return context.get(`events.pushAfterRendered.${this.getSlotName()}`) || [];
	}

	/**
	 * Setup observer for changes of ad slot sizes
	 */
	private setupSizesTracking(adType: string): void {
		const adFrame = this.getIframe();

		if (adFrame && adType.includes('success') && window['ResizeObserver']) {
			//@ts-ignore ResizeObserver is a native module in most of the modern browsers
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const width = Math.floor(entry.target.clientWidth);
					const height = Math.floor(entry.target.clientHeight);
					if (width > 0 && height > 0) {
						communicationService.emit(eventsRepository.AD_ENGINE_AD_RESIZED, {
							slot: this,
							sizes: { width, height },
						});
						resizeObserver.unobserve(entry.target);
					}
				}
			});

			resizeObserver.observe(adFrame);
		}
	}
}
