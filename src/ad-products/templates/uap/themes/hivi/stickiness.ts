import { AdSlot, slotTweaker, utils } from '@ad-engine/core';
import * as EventEmitter from 'eventemitter3';
import { isFunction } from 'lodash';
import { SLOT_FORCE_UNSTICK, SLOT_STICKED_STATE, SLOT_UNSTICKED_STATE } from '../../constants';

export type CustomWhen = (() => Promise<void>) | Promise<void>;

export class Stickiness extends EventEmitter {
	static LOG_GROUP = 'stickiness';
	static STICKINESS_CHANGE_EVENT = Symbol('stickinessChange');
	static CLOSE_CLICKED_EVENT = Symbol('closeClicked');
	static UNSTICK_IMMEDIATELY_EVENT = Symbol('unstickImmediately');

	static SLOT_STICKED_STATE = SLOT_STICKED_STATE;
	static SLOT_UNSTICKED_STATE = SLOT_UNSTICKED_STATE;
	static SLOT_STICKY_READY_STATE = 'sticky-ready';
	static SLOT_FORCE_UNSTICK = SLOT_FORCE_UNSTICK;
	static SLOT_STICKINESS_DISABLED = 'stickiness-disabled';

	sticky = false;
	private stickyConditions = [];
	private isStickinessBlocked = false;
	private isRevertStickinessBlocked = false;

	constructor(
		private adSlot: AdSlot,
		private customWhen: CustomWhen = Promise.resolve(),
		private waitForViewed = true,
	) {
		super();

		this.customWhen = isFunction(this.customWhen) ? this.customWhen() : this.customWhen;
		this.stickyConditions = [this.customWhen];
		if (this.waitForViewed) {
			this.stickyConditions.push(this.adSlot.viewed);
		}

		this.registerStickinessBlocking();
	}

	logger(...args: any[]): void {
		utils.logger(Stickiness.LOG_GROUP, ...args);
	}

	async run(): Promise<void> {
		await slotTweaker.onReady(this.adSlot);

		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		this.onAdReady();
	}

	isSticky(): boolean {
		return this.sticky;
	}

	applyStickiness(): void {
		if (!this.sticky) {
			this.logger('Applying stickiness');
			this.sticky = true;
			this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
		} else {
			this.logger('Stickiness is already applied');
		}
	}

	revertStickiness(): void {
		if (this.sticky) {
			this.logger('Reverting stickiness');
			this.sticky = false;
			this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
		} else {
			this.logger('Stickiness is already reverted');
		}
	}

	close(): void {
		this.logger('Closing and removing stickiness');
		this.sticky = false;
		this.emit(Stickiness.CLOSE_CLICKED_EVENT, this.sticky);
	}

	async registerRevertStickiness(): Promise<void> {
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

	registerStickinessBlocking(): void {
		Promise.all(this.stickyConditions).then(() => {
			if (!this.sticky) {
				this.logger('Blocking stickiness');
				this.isStickinessBlocked = true;
			}
		});
	}

	blockRevertStickiness(): void {
		this.isRevertStickinessBlocked = true;
	}

	unblockRevertStickiness(): void {
		this.isRevertStickinessBlocked = false;
	}

	async onAdReady(): Promise<void> {
		if (this.isStickinessBlocked) {
			return Promise.resolve();
		}

		this.adSlot.once('unstickImmediately', () => {
			this.logger('Unsticking');
			this.emit(Stickiness.UNSTICK_IMMEDIATELY_EVENT);
			this.sticky = false;
		});

		this.applyStickiness();
		this.logger('waiting for viewability and custom condition');

		await Promise.all(this.stickyConditions);

		this.registerRevertStickiness();
	}
}
