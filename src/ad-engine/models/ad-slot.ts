import * as EventEmitter from 'eventemitter3';
import { action, props } from 'ts-action';
import { AdStackPayload, eventService, slotTweaker } from '../';
import { overscrollListener } from '../listeners';
import { ADX, GptSizeMapping } from '../providers';
import { context, slotDataParamsUpdater, templateService } from '../services';
import { getTopOffset, LazyQueue, logger, stringBuilder } from '../utils';
import { Dictionary } from './dictionary';

export interface Targeting {
	amznbid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	src?: string;
	pos?: string;
	loc?: string;
	wsi?: string;
	rv?: number;
	[key: string]: googletag.NamedSize | number;
}

interface RepeatConfig {
	index: number;
	slotNamePattern: string;
	limit: number;
	updateProperties: Dictionary;
	additionalClasses?: string;
}

export interface SlotConfig {
	adProduct: string;
	disabled?: boolean;
	disableExpandAnimation?: boolean;
	firstCall?: boolean;
	forceSafeFrame?: boolean;
	aboveTheFold?: boolean;
	trackOverscrolled?: boolean;
	slotName?: string;
	nextSiblingSelector?: string;
	parentContainerSelector?: string;

	targeting: Targeting;
	videoAdUnit?: string;
	repeat?: RepeatConfig;
	adUnit?: string;
	sizes?: GptSizeMapping[];
	videoSizes?: number[][];
	defaultSizes?: any;
	viewportConflicts?: string[];
	outOfPage?: any;

	trackingKey?: string;
	audio?: boolean;
	autoplay?: boolean;
}

export interface WinningBidderDetails {
	name: string;
	price: number | string;
}

export const adSlotEvent = action(
	'[AdEngine] Ad Slot event',
	props<{
		event: string;
		payload?: any;
		adSlotName: string;
	}>(),
);

export class AdSlot extends EventEmitter {
	static CUSTOM_EVENT = 'customEvent';
	static PROPERTY_CHANGED_EVENT = 'propertyChanged';
	static SLOT_LOADED_EVENT = 'slotLoaded';
	static SLOT_VIEWED_EVENT = 'slotViewed';
	static SLOT_RENDERED_EVENT = 'slotRendered';
	static SLOT_STATUS_CHANGED = 'slotStatusChanged';
	static VIDEO_VIEWED_EVENT = 'videoViewed';
	static DESTROYED_EVENT = 'slotDestroyed';
	static HIDDEN_EVENT = 'slotHidden';
	static SHOWED_EVENT = 'slotShowed';

	static LOG_GROUP = 'AdSlot';

	static STATUS_BLOCKED = 'blocked';
	static STATUS_COLLAPSE = 'collapse';
	static STATUS_FORCED_COLLAPSE = 'forced_collapse';
	static STATUS_ERROR = 'error';
	static STATUS_SUCCESS = 'success';
	static STATUS_VIEWPORT_CONFLICT = 'viewport-conflict';
	static STATUS_HIVI_COLLAPSE = 'hivi-collapse';
	static STATUS_CLOSED_BY_PORVATA = 'closed-by-porvata';

	static AD_CLASS = 'gpt-ad';
	static HIDDEN_CLASS = 'hide';

	static TEMPLATES_LOADED = 'Templates Loaded';

	private slotViewed = false;

	config: SlotConfig;
	element: null | HTMLElement = null;
	status: null | string = null;
	isEmpty = true;
	enabled: boolean;
	events: LazyQueue;
	adUnit: string;
	advertiserId: null | string = null;
	orderId: null | string | number = null;
	creativeId: null | string | number = null;
	creativeSize: null | string | number[] = null;
	lineItemId: null | string | number = null;
	winningBidderDetails: null | WinningBidderDetails = null;
	trackOnStatusChanged = false;

	loaded = new Promise<void>((resolve) => {
		this.once(AdSlot.SLOT_LOADED_EVENT, () => {
			slotTweaker.setDataParam(this, 'slotLoaded', true);

			resolve();
		});
	});
	rendered = new Promise<void>((resolve) => {
		this.once(
			AdSlot.SLOT_RENDERED_EVENT,
			(event: googletag.events.SlotRenderEndedEvent, adType: string) => {
				this.updateOnRenderEnd(event, adType);

				resolve();
			},
		);
	});
	viewed = new Promise<void>((resolve) => {
		this.once(AdSlot.SLOT_VIEWED_EVENT, () => {
			slotTweaker.setDataParam(this, 'slotViewed', true);

			resolve();
		});
	});

	constructor(ad: AdStackPayload) {
		super();

		this.config = context.get(`slots.${ad.id}`) || {};
		this.enabled = !this.config.disabled;
		this.events = new LazyQueue();
		this.events.onItemFlush((event) => {
			this.on(event.name, event.callback);
		});

		this.config.slotName = this.config.slotName || ad.id;
		this.config.targeting = this.config.targeting || ({} as Targeting);
		this.config.targeting.src = this.config.targeting.src || context.get('src');
		this.config.targeting.pos = this.config.targeting.pos || this.getSlotName();

		this.viewed.then(() => {
			this.slotViewed = true;
		});

		this.addClass(AdSlot.AD_CLASS);
		if (!this.enabled) {
			this.hide();
		}
		this.events.flush();
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

	getIframe(): HTMLIFrameElement | null {
		const element = this.getElement();

		if (!element) {
			return null;
		}

		return element.querySelector<HTMLIFrameElement>('div[id*="_container_"] iframe');
	}

	getFrameType(): 'safe' | 'regular' | null {
		const iframe = this.getIframe();

		if (!iframe) {
			return null;
		}

		return iframe.dataset.isSafeframe === 'true' ? 'safe' : 'regular';
	}

	// Main position is the first value defined in the "pos" key-value (targeting)
	getMainPositionName(): string {
		const { pos = '' } = this.targeting;

		return (Array.isArray(pos) ? pos : pos.split(','))[0].toLowerCase();
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
		return this.config.targeting;
	}

	getDefaultSizes(): string {
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

		this.emit(AdSlot.TEMPLATES_LOADED, ...templateNames);

		if (this.config.trackOverscrolled) {
			overscrollListener.apply(this);
		}
	}

	collapse(status: string = AdSlot.STATUS_COLLAPSE): void {
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
			case 'manual':
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
	 * Pass all events through eventService before emitting directly from slot.
	 */
	emit(event: string | symbol, ...args: any[]): boolean {
		const result = super.emit(event, ...args);

		eventService.emit(event, this, ...args);
		this.emitPostQueueCast(event, args);

		this.logger(this.getSlotName(), event, result, ...args);

		return result;
	}

	emitEvent(eventName: null | string = null): void {
		if (eventName !== null) {
			this.emit(AdSlot.CUSTOM_EVENT, { status: eventName });
		}
	}

	private emitPostQueueCast(event: string | symbol, payload: any[]) {
		eventService.communicator.dispatch(
			adSlotEvent({
				payload: JSON.parse(JSON.stringify(payload)),
				event: event.toString(),
				adSlotName: this.getSlotName(),
			}),
		);
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
}
