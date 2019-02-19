import { context, utils } from '@wikia/ad-engine';

export class BaseBidder {
	constructor(name, bidderConfig, timeout = 2000) {
		this.name = name;
		this.logGroup = `${name}-bidder`;
		this.bidderConfig = bidderConfig;
		this.timeout = timeout;

		this.resetState();
		this.onResponse = () => this.onResponseCall();

		utils.logger(this.logGroup, 'created');
	}

	addResponseListener(callback) {
		this.onResponseCallbacks.push(callback);
	}

	call() {
		this.response = false;
		this.called = true;

		if (this.callBids) {
			this.callBids(this.onResponse);
		}

		utils.logger(this.logGroup, 'called');
	}

	/**
	 * Returns bidder slot alias if available, otherwise slot name
	 *
	 * @param {string} slotName
	 *
	 * @returns {string}
	 */
	getSlotAlias(slotName) {
		return context.get(`slots.${slotName}.bidderAlias`) || slotName;
	}

	getSlotBestPrice(slotName) {
		if (this.getBestPrice) {
			return this.getBestPrice(slotName);
		}

		return {};
	}

	getSlotTargetingParams(slotName) {
		if (!this.called || !this.isSlotSupported(slotName) || !this.getTargetingParams) {
			return {};
		}

		return this.getTargetingParams(slotName);
	}

	hasResponse() {
		return this.response;
	}

	isSupported() {
		return false;
	}

	isSlotSupported(slotName) {
		return this.isSupported(slotName);
	}

	onResponseCall() {
		this.response = true;

		if (this.calculatePrices) {
			this.calculatePrices();
		}

		this.onResponseCallbacks.flush();
		utils.logger(this.logGroup, 'respond');
	}

	resetState() {
		this.called = false;
		this.response = false;

		this.onResponseCallbacks = new utils.LazyQueue();
		this.onResponseCallbacks.onItemFlush((callback) => {
			callback(this.name);
		});
	}

	/**
	 * Fires the Promise if bidder replied or timeout is reached
	 *
	 * @returns {Promise}
	 */
	waitForResponse() {
		return utils.createWithTimeout((resolve) => {
			if (this.hasResponse()) {
				resolve();
			} else {
				this.addResponseListener(resolve);
			}
		}, this.timeout);
	}

	/**
	 * Check if bidder was called
	 *
	 * @returns {boolean}
	 */
	wasCalled() {
		return this.called;
	}
}
