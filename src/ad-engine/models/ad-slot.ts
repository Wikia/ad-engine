import EventEmitter from 'eventemitter3';
import { slotListener } from '../listeners';
import { ADX } from '../providers';
import { context, slotDataParamsUpdater, slotTweaker, templateService } from '../services';
import { LazyQueue, logger, stringBuilder } from '../utils';

export interface SlotConfig {
	disabled?: boolean;
	firstCall?: boolean;
	aboveTheFold?: boolean;
	slotName?: string;

	targeting: { [key: string]: any };
	videoAdUnit?: any;
	repeat?: any;
	adUnit?: string;
	sizes?: any;
	videoSizes?: any;
	defaultSizes?: any;
	viewportConflicts?: any[];
	outOfPage?: any;
}

export class AdSlot extends EventEmitter {
	static PROPERTY_CHANGED_EVENT = 'propertyChanged';
	static SLOT_LOADED_EVENT = 'slotLoaded';
	static SLOT_VIEWED_EVENT = 'slotViewed';
	static VIDEO_VIEWED_EVENT = 'videoViewed';

	static LOG_GROUP = 'AdSlot';

	static STATUS_SUCCESS = 'success';
	static STATUS_COLLAPSE = 'collapse';
	static STATUS_ERROR = 'error';

	static AD_CLASS = 'gpt-ad';

	config: SlotConfig;
	viewed = false;
	element = null;
	status = null;
	enabled: boolean;
	events: LazyQueue;
	adUnit: string;

	constructor(ad) {
		super();

		this.config = context.get(`slots.${ad.id}`) || {};
		this.enabled = !this.config.disabled;
		this.events = new LazyQueue();
		this.events.onItemFlush((event) => {
			this.on(event.name, event.callback);
		});

		this.creativeId = null;
		this.creativeSize = null;
		this.lineItemId = null;

		this.config.slotName = this.config.slotName || ad.id;
		this.config.targeting = this.config.targeting || {};
		this.config.targeting.src = this.config.targeting.src || context.get('src');
		this.config.targeting.pos = this.config.targeting.pos || this.getSlotName();

		this.winningPbBidderDetails = null;

		this.once(AdSlot.SLOT_VIEWED_EVENT, () => {
			this.viewed = true;
		});

		this.onLoadPromise = new Promise((resolve) => {
			this.once(AdSlot.SLOT_LOADED_EVENT, resolve);
		});

		this.addClass(AdSlot.AD_CLASS);
		if (!this.enabled) {
			slotTweaker.hide(this);
		}

		this.logger = (...args) => logger(AdSlot.LOG_GROUP, ...args);
	}

	getAdUnit() {
		if (!this.adUnit) {
			this.adUnit = stringBuilder.build(this.config.adUnit || context.get('adUnitId'), {
				slotConfig: this.config,
			});
		}

		return this.adUnit;
	}

	getVideoAdUnit() {
		return stringBuilder.build(this.config.videoAdUnit || context.get('vast.adUnitId'), {
			slotConfig: this.config,
		});
	}

	getElement() {
		if (!this.element) {
			this.element = document.getElementById(this.getSlotName());
		}

		return this.element;
	}

	getSlotName() {
		return this.config.slotName;
	}

	getSizes() {
		return this.config.sizes;
	}

	/**
	 * Convenient property to get targeting.
	 * @returns {Object}
	 */
	get targeting() {
		return this.config.targeting;
	}

	getTargeting() {
		return this.config.targeting;
	}

	getDefaultSizes() {
		return this.config.defaultSizes;
	}

	getVideoSizes() {
		return this.config.videoSizes;
	}

	getViewportConflicts() {
		return this.config.viewportConflicts || [];
	}

	hasDefinedViewportConflicts() {
		return this.getViewportConflicts().length > 0;
	}

	getStatus() {
		return this.status;
	}

	setStatus(status = null) {
		this.status = status;
		if (status !== null) {
			this.emit(status);
			slotListener.emitStatusChanged(this);
		}
	}

	isEnabled() {
		return this.enabled;
	}

	isFirstCall(): boolean {
		return !!this.config.firstCall;
	}

	isViewed() {
		return this.viewed;
	}

	isRepeatable() {
		return !!this.config.repeat;
	}

	isOutOfPage() {
		return !!this.config.outOfPage;
	}

	getCopy() {
		return JSON.parse(JSON.stringify(this.config));
	}

	enable() {
		this.enabled = true;
	}

	disable(status = null) {
		this.enabled = false;
		this.setStatus(status);
		slotTweaker.hide(this);
	}

	getConfigProperty(key) {
		return context.get(`slots.${this.config.slotName}.${key}`);
	}

	setConfigProperty(key, value) {
		context.set(`slots.${this.config.slotName}.${key}`, value);
	}

	onLoad() {
		return this.onLoadPromise;
	}

	success(status = AdSlot.STATUS_SUCCESS) {
		slotTweaker.show(this);
		this.setStatus(status);

		const templateNames = this.getConfigProperty('defaultTemplates');

		if (templateNames && templateNames.length) {
			templateNames.forEach((templateName) => templateService.init(templateName, this));
		}
	}

	collapse(status = AdSlot.STATUS_COLLAPSE) {
		slotTweaker.hide(this);
		this.setStatus(status);
	}

	emitEvent(eventName = null) {
		if (eventName !== null) {
			slotListener.emitCustomEvent(eventName, this);
		}
	}

	updateWinningPbBidderDetails() {
		if (this.targeting.hb_bidder && this.targeting.hb_pb) {
			this.winningPbBidderDetails = {
				name: this.targeting.hb_bidder,
				price: this.targeting.hb_pb,
			};
		} else {
			this.winningPbBidderDetails = null;
		}
	}

	updateOnRenderEnd(event) {
		if (!event) {
			return;
		}

		let { creativeId, lineItemId } = event;

		if (!event.isEmpty && event.slot) {
			const resp = event.slot.getResponseInformation();

			if (resp) {
				if (resp.sourceAgnosticCreativeId && resp.sourceAgnosticLineItemId) {
					this.logger('set line item and creative id to source agnostic values');
					creativeId = resp.sourceAgnosticCreativeId;
					lineItemId = resp.sourceAgnosticLineItemId;
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
