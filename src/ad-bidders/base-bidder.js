import { context, utils } from '@wikia/ad-engine';

export class BaseBidder {
	constructor(name, bidderConfig, timeout = 2000) {
		this.name = name;
		this.logGroup = `${name}-bidder`;
		this.bidderConfig = bidderConfig;
		this.timeout = timeout;
		this.utils = utils;
		this.context = context;

		this.resetState();

		this.utils.logger(this.logGroup, 'created');
	}

	resetState() {
		this.called = false;
		this.response = false;
		this.onResponseCallbacks = [];

		this.onResponseCallbacks = new utils.LazyQueue();
		this.onResponseCallbacks.onItemFlush((callback) => {
			callback(this.name);
		});
	}

	call() {
		this.response = false;
		this.called = true;

		this.callBids(() => this.onBidResponse());

		this.utils.logger(this.logGroup, 'called');
	}

	onBidResponse() {
		this.response = true;

		this.calculatePrices();
		this.onResponseCallbacks.flush();

		this.utils.logger(this.logGroup, 'respond');
	}

	createWithTimeout(func, msToTimeout = 2000) {
		return Promise.race([new Promise(func), this.utils.timeoutReject(msToTimeout)]);
	}

	/**
	 * Returns bidder slot alias if available, otherwise slot name
	 * @param {string} slotName
	 * @returns {string}
	 */
	getSlotAlias(slotName) {
		return context.get(`slots.${slotName}.bidderAlias`) || slotName;
	}

	getSlotBestPrice(slotName) {
		return this.getBestPrice(slotName);
	}

	getSlotTargetingParams(slotName) {
		if (!this.called || !this.isSlotSupported(slotName)) {
			return {};
		}

		return this.getTargetingParams(slotName);
	}

	isSlotSupported(slotName) {
		return this.isSupported(slotName);
	}

	/**
	 * Fires the Promise if bidder replied or timeout is reached
	 * @returns {Promise}
	 */
	waitForResponse() {
		// TODO Remove utils.createWithTimeout or use it here,
		// or change it entirely!!!
		return this.createWithTimeout((resolve) => {
			if (this.hasResponse()) {
				resolve();
			} else {
				this.addResponseListener(resolve);
			}
		}, this.timeout);
	}

	hasResponse() {
		return this.response;
	}

	addResponseListener(callback) {
		this.onResponseCallbacks.push(callback);
	}

	/**
	 * Check if bidder was called
	 * @returns {boolean}
	 */
	wasCalled() {
		return this.called;
	}

	/** @abstract */
	// eslint-disable-next-line no-unused-vars
	callBids(cb) {}

	/** @abstract */
	calculatePrices() {}

	/** @abstract */
	// eslint-disable-next-line no-unused-vars
	getBestPrice(slotName) {
		return {};
	}

	/** @abstract */
	// eslint-disable-next-line no-unused-vars
	getTargetingParams(slotName) {
		return {};
	}

	/** @abstract */
	// eslint-disable-next-line no-unused-vars
	isSupported(slotName) {
		return false;
	}
}
