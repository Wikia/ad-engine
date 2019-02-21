import { context, utils } from '@wikia/ad-engine';

/**
 * @abstract
 */
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

	/**
	 * @protected
	 */
	onBidResponse() {
		this.response = true;

		this.calculatePrices();
		this.onResponseCallbacks.flush();

		this.utils.logger(this.logGroup, 'respond');
	}

	/**
	 * Returns bidder slot alias if available, otherwise slot name
	 * @protected
	 * @param {string} slotName
	 * @returns {string}
	 */
	getSlotAlias(slotName) {
		return context.get(`slots.${slotName}.bidderAlias`) || slotName;
	}

	/**
	 * @param {string} slotName
	 * @returns {{}}
	 */
	getSlotBestPrice(slotName) {
		return this.getBestPrice(slotName);
	}

	/**
	 * @param {string} slotName
	 * @returns {{}}
	 */
	getSlotTargetingParams(slotName) {
		if (!this.called || !this.isSlotSupported(slotName)) {
			return {};
		}

		return this.getTargetingParams(slotName);
	}

	/**
	 * @param {string} slotName
	 * @returns {boolean}
	 */
	isSlotSupported(slotName) {
		return this.isSupported(slotName);
	}

	/**
	 * Fires the Promise if bidder replied or timeout is reached
	 * @returns {Promise}
	 */
	waitForResponse() {
		return this.utils.createWithTimeout((resolve) => {
			if (this.hasResponse()) {
				resolve();
			} else {
				this.addResponseListener(resolve);
			}
		}, this.timeout);
	}

	/**
	 * @returns {boolean}
	 */
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

	/**
	 * @abstract
	 * @protected
	 */
	callBids(cb) {
		throw new utils.NotImplementedException({ cb });
	}

	/**
	 * @abstract
	 * @protected
	 */
	calculatePrices() {
		throw new utils.NotImplementedException();
	}

	/**
	 * @abstract
	 * @protected
	 * @param {string} slotName
	 * @returns {*|{}}
	 */
	getBestPrice(slotName) {
		throw new utils.NotImplementedException({ slotName });
	}

	/**
	 * @abstract
	 * @protected
	 * @param {string} slotName
	 * @returns {*|{}}
	 */
	getTargetingParams(slotName) {
		throw new utils.NotImplementedException({ slotName });
	}

	/**
	 * Checks if slot with given name is supported by bidder.
	 * @abstract
	 * @protected
	 * @param {string} slotName
	 * @returns {boolean}
	 */
	isSupported(slotName) {
		throw new utils.NotImplementedException({ slotName });
	}
}
