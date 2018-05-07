import EventEmitter from 'eventemitter3';
import { context, slotTweaker, templateService } from '../services';
import { stringBuilder } from '../utils';
import { slotListener } from '../listeners';

export class AdSlot extends EventEmitter {
	static PROPERTY_CHANGED_EVENT = 'propertyChanged';
	static SLOT_VIEWED_EVENT = 'slotViewed';
	static VIDEO_VIEWED_EVENT = 'videoViewed';

	/**
	 * Parse the object that's passed from the template to extract more details
	 * @param {object} ad Object containing an ad id and page type
	 *      Format of id is:
	 *           gpt-<location>-<ad-type>[-<screen-size>]
	 *      Examples:
	 *           gpt-top-leaderboard
	 *           gpt-bottom-boxad-mobile
	 *           gpt-bottom-leaderboard-desktop
	 */
	constructor(ad) {
		super();

		const segments = ad.id.split('-');
		const [, location, type, screenSize] = segments;

		if (segments.length < 3) {
			throw new Error(`Invalid GPT id passed to parseId (${ad.id}).`);
		}

		this.id = ad.id;
		this.location = location;
		this.screenSize = screenSize || 'both';
		this.type = type;
		this.config = context.get(`slots.${this.location}-${this.type}`) || {};
		this.enabled = !this.config.disabled;
		this.viewed = false;
		this.element = null;
		this.status = null;

		this.config.targeting = this.config.targeting || {};
		this.config.targeting.src = this.config.targeting.src || context.get('src');
		this.config.targeting.pos = this.config.targeting.pos || this.getSlotName();

		this.once(AdSlot.SLOT_VIEWED_EVENT, () => {
			this.viewed = true;
		});
	}

	getId() {
		return this.id;
	}

	getAdUnit() {
		if (!this.adUnit) {
			this.adUnit = stringBuilder.build(
				this.config.adUnit || context.get('adUnitId'),
				{
					slotConfig: this.config
				}
			);
		}

		return this.adUnit;
	}

	getVideoAdUnit() {
		return stringBuilder.build(this.config.videoAdUnit || context.get('vast.adUnitId'), {
			slotConfig: this.config
		});
	}

	getElement() {
		if (!this.element) {
			this.element = document.getElementById(this.id);
		}

		return this.element;
	}

	getSlotName() {
		return this.config.slotName;
	}

	getSizes() {
		return this.config.sizes;
	}

	getTargeting() {
		return this.config.targeting;
	}

	getDefaultSizes() {
		return this.config.defaultSizes;
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
			slotListener.emitStatusChanged(this);
		}
	}

	shouldLoad() {
		const isMobile = context.get('state.isMobile'),
			shouldLoad = this.screenSize === 'both',
			shouldLoadDesktop = !isMobile && this.screenSize === 'desktop',
			shouldLoadMobile = isMobile && this.screenSize === 'mobile';

		return shouldLoad || shouldLoadDesktop || shouldLoadMobile;
	}

	isAboveTheFold() {
		return !!this.config.aboveTheFold;
	}

	isEnabled() {
		return this.enabled;
	}

	isViewed() {
		return this.viewed;
	}

	enable() {
		this.enabled = true;
	}

	disable(status = null) {
		this.enabled = false;
		this.setStatus(status);
	}

	setConfigProperty(key, value) {
		context.set(`slots.${this.location}-${this.type}.${key}`, value);
	}

	success(status = 'success') {
		slotTweaker.show(this);
		this.setStatus(status);

		if (this.config.defaultTemplate) {
			templateService.init(this.config.defaultTemplate, this);
		}
	}

	collapse(status = 'collapse') {
		slotTweaker.hide(this);
		this.setStatus(status);
	}
}
