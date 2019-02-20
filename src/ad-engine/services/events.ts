import * as EventEmitter from 'eventemitter3';
import { logger } from '../utils';

const groupName = 'events';

class EventService extends EventEmitter.EventEmitter {
	AD_SLOT_CREATED = 'AD_SLOT_CREATED';
	AD_STACK_START = 'AD_STACK_START';
	BEFORE_PAGE_CHANGE_EVENT = 'BEFORE_PAGE_CHANGE_EVENT';
	PAGE_CHANGE_EVENT = 'PAGE_CHANGE_EVENT';
	PAGE_RENDER_EVENT = 'PAGE_RENDER_EVENT';

	// video events should happen in the order below
	VIDEO_AD_REQUESTED = 'VIDEO_AD_REQUESTED';
	VIDEO_AD_ERROR = 'VIDEO_AD_ERROR';
	VIDEO_AD_IMPRESSION = 'VIDEO_AD_IMPRESSION';
	VIDEO_AD_USED = 'VIDEO_AD_USED';

	BIDS_REFRESH = 'BIDS_REFRESH';
	PREBID_LAZY_CALL = 'PREBID_LAZY_CALL';

	VIDEO_PLAYER_TRACKING_EVENT = 'VIDEO_PLAYER_TRACKING_EVENT';

	BILL_THE_LIZARD_REQUEST = 'BILL_THE_LIZARD_REQUEST';
	BILL_THE_LIZARD_RESPONSE = 'BILL_THE_LIZARD_RESPONSE';

	MOAT_YI_READY = 'MOAT_YI_READY';

	beforePageChange(...args) {
		this.emit(this.BEFORE_PAGE_CHANGE_EVENT, ...args);
	}

	pageChange(...args) {
		this.emit(this.PAGE_CHANGE_EVENT, ...args);
	}

	pageRender(...args) {
		this.emit(this.PAGE_RENDER_EVENT, ...args);
	}

	hasEvent(event) {
		return Object.getOwnPropertyNames(this).some(
			(name) => typeof this[name] === 'symbol' && this[name] === event,
		);
	}

	emit(event: string, ...args: any[]): boolean {
		if (!this.hasEvent(event)) {
			throw new Error(`Event "${event}" is not registered. Please register an event first.`);
		}

		super.emit(event, ...args);
		logger(groupName, 'emit', event, ...args);

		return true;
	}

	on(event: string, fn: EventEmitter.ListenerFn, context?: any) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		return super.on(event, fn, context);
	}

	addListener(event: string, fn: EventEmitter.ListenerFn, context?: any) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		return super.addListener(event, fn, context);
	}

	once(event: string, fn: EventEmitter.ListenerFn, context?: any) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		return super.once(event, fn, context);
	}

	registerEvent(name) {
		if (typeof name !== 'string') {
			throw new Error('Event name must be a string.');
		}

		if (this[name] !== undefined) {
			throw new Error(`Event or property "${name}" already exists.`);
		}

		this[name] = Symbol(name);

		return this[name];
	}

	getRegisteredEventNames() {
		return Object.getOwnPropertyNames(this).filter((name) => typeof this[name] === 'symbol');
	}
}

export const events = new EventService();
