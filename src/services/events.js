import EventEmitter from 'eventemitter3';

class EventService extends EventEmitter {
	PAGE_CHANGE_EVENT = Symbol('PAGE_CHANGE_EVENT');
	PAGE_RENDER_EVENT = Symbol('PAGE_RENDER_EVENT');

	pageChange(...args) {
		this.emit(this.PAGE_CHANGE_EVENT, ...args);
	}

	pageRender(...args) {
		this.emit(this.PAGE_RENDER_EVENT, ...args);
	}

	hasEvent(event) {
		return Object.getOwnPropertyNames(this).some(
			name => (typeof this[name] === 'symbol' && this[name] === event)
		);
	}

	emit(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error(`Event "${event}" is not registered. Please register an event first.`);
		}

		super.emit(event, ...args);
	}

	on(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error('You can\'t listen for an event which is not registered yet.');
		}

		super.on(event, ...args);
	}

	addListener(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error('You can\'t listen for an event which is not registered yet.');
		}

		super.addListener(event, ...args);
	}

	once(event, ...args) {
		if (!this.hasEvent(event)) {
			throw new Error('You can\'t listen for an event which is not registered yet.');
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
		return Object.getOwnPropertyNames(this).filter(name => typeof this[name] === 'symbol');
	}
}

export const events = new EventService();
