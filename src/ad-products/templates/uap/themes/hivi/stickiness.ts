import EventEmitter from 'eventemitter3';
import { isFunction } from 'lodash';
import { AdSlot, slotTweaker, utils } from '@wikia/ad-engine';

export class Stickiness extends EventEmitter {
	static LOG_GROUP = 'stickiness';
	static STICKINESS_CHANGE_EVENT = Symbol('stickinessChange');
	static CLOSE_CLICKED_EVENT = Symbol('closeClicked');
	static UNSTICK_IMMEDIATELY_EVENT = Symbol('unstickImmediately');

	static SLOT_STICKED_STATE = 'sticked';
	static SLOT_UNSTICKED_STATE = 'unsticked';
	static SLOT_STICKY_READY_STATE = 'sticky-ready';
	static SLOT_UNSTICK_IMMEDIATELY = 'force-unstick';
	static SLOT_STICKINESS_DISABLED = 'stickiness-disabled';

	constructor(adSlot, customWhen = Promise.resolve()) {
		super();

		this.adSlot = adSlot;
		this.customWhen = customWhen;
		this.sticky = false;
		this.isStickinessBlocked = false;
		this.isRevertStickinessBlocked = false;
		this.logger = (...args) => utils.logger(Stickiness.LOG_GROUP, ...args);

		if (!isFunction(this.customWhen)) {
			Promise.all([this.customWhen]).then(() => {
				if (!this.sticky) {
					this.logger('Blocking stickiness');
					this.isStickinessBlocked = true;
				}
			});
		}
	}

	async run() {
		await slotTweaker.onReady(this.adSlot);

		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		this.adSlot.once('unstickImmediately', () => {
			this.logger('Unsticking');
			this.emit(Stickiness.UNSTICK_IMMEDIATELY_EVENT);
			this.sticky = false;
		});

		if (!this.isStickinessBlocked) {
			this.onAdReady();
		}
	}

	isSticky() {
		return this.sticky;
	}

	applyStickiness() {
		if (!this.sticky) {
			this.logger('Applying stickiness');
			this.sticky = true;
			this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
		} else {
			this.logger('Stickiness is already applied');
		}
	}

	revertStickiness() {
		if (this.sticky) {
			this.logger('Reverting stickiness');
			this.sticky = false;
			this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
		} else {
			this.logger('Stickiness is already reverted');
		}
	}

	close() {
		this.logger('Closing and removing stickiness');
		this.sticky = false;
		this.emit(Stickiness.CLOSE_CLICKED_EVENT, this.sticky);
	}

	async registerRevertStickiness() {
		this.logger('waiting for user interaction');
		await utils.once(window, 'scroll');
		// wait for callback that are triggered after scroll event (eg. 'wikiaFullscreenChange')
		await utils.wait();
		if (!this.isRevertStickinessBlocked) {
			this.revertStickiness();
		} else {
			this.registerRevertStickiness();
		}
	}

	blockRevertStickiness() {
		this.isRevertStickinessBlocked = true;
	}

	unblockRevertStickiness() {
		this.isRevertStickinessBlocked = false;
	}

	async onAdReady() {
		this.applyStickiness();
		this.logger('waiting for viewability and custom condition');

		await Promise.all([
			!this.adSlot.isViewed()
				? utils.once(this.adSlot, AdSlot.SLOT_VIEWED_EVENT)
				: Promise.resolve(),
			isFunction(this.customWhen) ? this.customWhen() : this.customWhen,
		]);

		this.registerRevertStickiness();
	}
}
