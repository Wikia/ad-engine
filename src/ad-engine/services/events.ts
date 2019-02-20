import EventEmitter from 'eventemitter3';
import { logger } from '../utils';

const groupName = 'events';

class EventService extends EventEmitter {
	AD_SLOT_CREATED = Symbol('AD_SLOT_CREATED');
	AD_STACK_START = Symbol('AD_STACK_START');
	BEFORE_PAGE_CHANGE_EVENT = Symbol('BEFORE_PAGE_CHANGE_EVENT');
	PAGE_CHANGE_EVENT = Symbol('PAGE_CHANGE_EVENT');
	PAGE_RENDER_EVENT = Symbol('PAGE_RENDER_EVENT');

	// video events should happen in the order below
	VIDEO_AD_REQUESTED = Symbol('VIDEO_AD_REQUESTED');
	VIDEO_AD_ERROR = Symbol('VIDEO_AD_ERROR');
	VIDEO_AD_IMPRESSION = Symbol('VIDEO_AD_IMPRESSION');
	VIDEO_AD_USED = Symbol('VIDEO_AD_USED');

	BIDS_REFRESH = Symbol('BIDS_REFRESH');
	PREBID_LAZY_CALL = Symbol('PREBID_LAZY_CALL');

	VIDEO_PLAYER_TRACKING_EVENT = Symbol('VIDEO_PLAYER_TRACKING_EVENT');

	BILL_THE_LIZARD_REQUEST = Symbol('BILL_THE_LIZARD_REQUEST');
	BILL_THE_LIZARD_RESPONSE = Symbol('BILL_THE_LIZARD_RESPONSE');


	MOAT_YI_READY = Symbol('MOAT_YI_READY');

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

	emit(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error(`Event "${event}" is not registered. Please register an event first.`);
		}

		super.emit(event, ...args);
		logger(groupName, 'emit', event, ...args);
	}

	on(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		super.on(event, ...args);
	}

	addListener(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		super.addListener(event, ...args);
	}

	once(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error("You can't listen for an event which is not registered yet.");
		}

		super.once(event, ...args);
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
