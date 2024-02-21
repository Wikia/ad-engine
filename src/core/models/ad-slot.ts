import { communicationService, eventsRepository } from '@ad-engine/communication';
import type { AdStackPayload } from '../';
import {
	AdSlotStatus,
	SlotPlaceholderContextConfig,
	SlotTargeting,
	slotTweaker,
	targetingService,
	utils,
} from '../';
import { ADX, type GptSizeMapping } from '../providers';
import { context, slotDataParamsUpdater, templateService } from '../services';
import { AD_LABEL_CLASS, getTopOffset, logger, stringBuilder } from '../utils';
import { AdSlotEvent } from './ad-slot-event';
import { Dictionary } from './dictionary';

export interface RepeatConfig {
	index: number;
	slotNamePattern: string;
	limit: number;
	updateProperties: Dictionary;
	updateCreator?: Dictionary;
	disablePushOnScroll?: boolean;
}

export interface BaseSlotConfig {
	defaultSizes?: any;
	targeting?: SlotTargeting;
}

export interface SlotConfig extends BaseSlotConfig {
	uid: string;
	adProduct: string;
	bidderAlias: string;
	a9Alias?: string;
	disabled?: boolean;
	firstCall?: boolean;
	slotName?: string;
	slotNameSuffix: string;

	videoAdUnit?: string;
	repeat?: RepeatConfig;
	adUnit?: string;
	sizes?: GptSizeMapping[];
	videoSizes?: number[][];
	viewportConflicts?: string[];
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
	static LOG_GROUP = 'AdSlot';

	static AD_CLASS = 'gpt-ad';
	static AD_SLOT_PLACEHOLDER_CLASS = 'ad-slot-placeholder';
	static HIDDEN_AD_CLASS = 'hidead';

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
		this.setUpSlotTargeting();
		delete this.config.targeting;

		this.requested = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlotEvent.SLOT_REQUESTED_EVENT,
				() => {
					this.pushTime = new Date().getTime();

					resolve();
				},
				this.getSlotName(),
			);
		});
		this.loaded = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlotEvent.SLOT_LOADED_EVENT,
				() => {
					slotTweaker.setDataParam(this, 'slotLoaded', true);

					resolve();
				},
				this.getSlotName(),
			);
		});
		this.rendered = new Promise<void>((resolve) => {
			communicationService.onSlotEvent(
				AdSlotEvent.SLOT_RENDERED_EVENT,
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
				AdSlotEvent.SLOT_VIEWED_EVENT,
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

	private setUpSlotTargeting() {
		const targetingData = this.config.targeting || ({} as SlotTargeting);
		targetingData.src = targetingData.src || context.get('src');
		targetingData.pos = targetingData.pos || this.getSlotName();
		targetingData.rv = targetingData.rv || '1';
		targetingService.extend(targetingData, this.getSlotName());
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
		const { pos = '' } = targetingService.dump(this.getSlotName());

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
	get targeting(): SlotTargeting {
		return targetingService.dump<SlotTargeting>(this.getSlotName());
	}

	getTargeting(): SlotTargeting {
		return this.parseTargetingParams(targetingService.dump<SlotTargeting>(this.getSlotName()));
	}

	private parseTargetingParams(targetingParams: Dictionary): SlotTargeting {
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

		return result as SlotTargeting;
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
			this.emit(AdSlotEvent.SLOT_STATUS_CHANGED);
		}
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	isFirstCall(): boolean {
		return !!this.config.firstCall;
	}

	isViewed(): boolean {
		return this.slotViewed;
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
		this.emit(AdSlotEvent.DESTROY_EVENT);
	}

	getConfigProperty(key: string): any {
		return context.get(`slots.${this.config.slotName}.${key}`);
	}

	getTargetingProperty(key: string): any {
		return targetingService.get(key, this.getSlotName());
	}

	setConfigProperty(key: string, value: any): void {
		context.set(`slots.${this.config.slotName}.${key}`, value);
	}

	setTargetingConfigProperty(key: string, value: any): void {
		targetingService.set(key, value, this.config.slotName);
	}

	success(status: string = AdSlotStatus.STATUS_SUCCESS): void {
		if (!this.getConfigProperty('showManually')) {
			this.show();
		}
		this.setStatus(status);

		const templateNames = this.getConfigProperty('skipTemplates')
			? []
			: this.getConfigProperty('defaultTemplates') || [];

		if (templateNames && templateNames.length) {
			templateNames.forEach((templateName: string) => templateService.init(templateName, this));
		}

		this.emit(AdSlotEvent.TEMPLATES_LOADED, templateNames);

		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_LOADED, {
			name: this.getSlotName(),
			state: AdSlotStatus.STATUS_SUCCESS,
		});

		this.setupDelayedCollapse();
	}

	private setupDelayedCollapse() {
		communicationService.on(
			eventsRepository.GAM_AD_DELAYED_COLLAPSE,
			(payload) => {
				if (payload.source.includes(this.getSlotName())) {
					this.collapse();
				}
			},
			false,
		);
	}

	collapse(status: string = AdSlotStatus.STATUS_COLLAPSE): void {
		communicationService.emit(eventsRepository.AD_ENGINE_SLOT_LOADED, {
			name: this.getSlotName(),
			state: AdSlotStatus.STATUS_COLLAPSE,
		});

		this.hide();
		this.setStatus(status);
	}

	updateWinningPbBidderDetails(): void {
		if (this.getTargetingProperty('hb_bidder') && this.getTargetingProperty('hb_pb')) {
			this.winningBidderDetails = {
				name: this.getTargetingProperty('hb_bidder'),
				price: this.getTargetingProperty('hb_pb'),
			};
		} else {
			this.winningBidderDetails = null;
		}
	}

	updateWinningA9BidderDetails(): void {
		if (this.getTargetingProperty('amznbid')) {
			this.winningBidderDetails = {
				name: 'a9',
				price: this.getTargetingProperty('amznbid'),
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
			case AdSlotStatus.STATUS_COLLAPSE:
			case AdSlotStatus.STATUS_FORCED_COLLAPSE:
				this.collapse(adType);
				break;
			case AdSlotStatus.STATUS_MANUAL:
				this.setStatus(adType);
				break;
			case AdSlotStatus.STATUS_SKIP_TEMPLATE:
				this.setConfigProperty('skipTemplates', true);
				this.success();
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
	 * Adds class AdSlot.HIDDEN_AD_CLASS to adSlot's element.
	 */
	hide(): void {
		const added = this.addClass(AdSlot.HIDDEN_AD_CLASS);

		if (added) {
			this.emit(AdSlotEvent.HIDDEN_EVENT);
		}
	}

	/**
	 * Shows adSlot.
	 *
	 * Removes class AdSlot.HIDDEN_AD_CLASS from adSlot's element.
	 */
	show(): void {
		const removed = this.removeClass(AdSlot.HIDDEN_AD_CLASS);

		if (removed) {
			this.emit(AdSlotEvent.SHOWED_EVENT);
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
			this.emit(AdSlotEvent.CUSTOM_EVENT, { status: eventName });
		}
	}

	/**
	 * Setup observer for changes of ad slot sizes
	 */
	private setupSizesTracking(adType: string): void {
		const adFrame = this.getIframe();

		if (adFrame && adType.includes('success') && window['ResizeObserver']) {
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const width = Math.floor(entry.target.clientWidth);
					const height = Math.floor(entry.target.clientHeight);
					// excludes empty slots (0x0) and collapsinator (1x1)
					if (width > 0 && height > 0 && (width != 1 || height != 1)) {
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
