import * as EventEmitter from 'eventemitter3';
import { AdStackPayload } from '../';
import { slotListener } from '../listeners';
import { ADX, GptSizeMapping } from '../providers';
import { context, slotDataParamsUpdater, slotTweaker, templateService } from '../services';
import { LazyQueue, logger, stringBuilder } from '../utils';
import { Dictionary } from './dictionary';

export interface Targeting {
	[key: string]: googletag.NamedSize;
	amznbid?: string;
	hb_bidder?: string;
	hb_pb?: string;
	src?: string;
	pos?: string;
	wsi?: string;
	// @ts-ignore
	rv?: number;
}

interface RepeatConfig {
	index: number;
	slotNamePattern: string;
	limit: number;
	updateProperties: Dictionary;
	additionalClasses?: string;
}

export interface SlotConfig {
	disabled?: boolean;
	firstCall?: boolean;
	aboveTheFold?: boolean;
	slotName?: string;

	targeting: Targeting;
	videoAdUnit?: string;
	repeat?: RepeatConfig;
	adUnit?: string;
	sizes?: GptSizeMapping[];
	videoSizes?: number[][];
	defaultSizes?: any;
	viewportConflicts?: string[];
	outOfPage?: any;

	audio?: boolean;
	autoplay?: boolean;
}

export interface WinningBidderDetails {
	name: string;
	price: number | string;
}

export class AdSlot extends EventEmitter {
	static PROPERTY_CHANGED_EVENT = 'propertyChanged';
	static SLOT_LOADED_EVENT = 'slotLoaded';
	static SLOT_VIEWED_EVENT = 'slotViewed';
	static VIDEO_VIEWED_EVENT = 'videoViewed';
	static DESTROYED_EVENT = 'slotDestroyed';

	static LOG_GROUP = 'AdSlot';

	static STATUS_SUCCESS = 'success';
	static STATUS_COLLAPSE = 'collapse';
	static STATUS_ERROR = 'error';

	static AD_CLASS = 'gpt-ad';

	config: SlotConfig;
	viewed = false;
	element: null | HTMLElement = null;
	status: null | string = null;
	isEmpty = true;
	enabled: boolean;
	events: LazyQueue;
	adUnit: string;
	orderId: null | string | number = null;
	creativeId: null | string | number = null;
	creativeSize: null | string | number[] = null;
	lineItemId: null | string | number = null;
	winningBidderDetails: null | WinningBidderDetails = null;
	onLoadPromise = new Promise<HTMLIFrameElement>((resolve) => {
		this.once(AdSlot.SLOT_LOADED_EVENT, resolve);
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

		this.once(AdSlot.SLOT_VIEWED_EVENT, () => {
			this.viewed = true;
		});

		this.addClass(AdSlot.AD_CLASS);
		if (!this.enabled) {
			slotTweaker.hide(this);
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

	getElement(): HTMLElement {
		if (!this.element) {
			this.element = document.getElementById(this.getSlotName());
		}

		return this.element;
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
			slotListener.emitStatusChanged(this);
		}
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	isFirstCall(): boolean {
		return !!this.config.firstCall;
	}

	isViewed(): boolean {
		return this.viewed;
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

	enable(): void {
		this.enabled = true;
	}

	disable(status: null | string = null): void {
		this.enabled = false;
		this.setStatus(status);
		slotTweaker.hide(this);
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

	onLoad(): Promise<HTMLIFrameElement> {
		return this.onLoadPromise;
	}

	success(status: string = AdSlot.STATUS_SUCCESS): void {
		slotTweaker.show(this);
		this.setStatus(status);

		const templateNames = this.getConfigProperty('defaultTemplates');

		if (templateNames && templateNames.length) {
			templateNames.forEach((templateName: string) => templateService.init(templateName, this));
		}
	}

	collapse(status: string = AdSlot.STATUS_COLLAPSE): void {
		slotTweaker.hide(this);
		this.setStatus(status);
	}

	emitEvent(eventName: null | string = null): void {
		if (eventName !== null) {
			slotListener.emitCustomEvent(eventName, this);
		}
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

	updateOnRenderEnd(event: googletag.events.SlotRenderEndedEvent): void {
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
	}

	/**
	 * Appends gpt-ad class to adSlot node.
	 */
	addClass(className: string): boolean {
		const container = this.getElement();

		if (container) {
			container.classList.add(className);

			return true;
		}

		return false;
	}
}
