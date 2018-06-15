import { logger, makeLazyQueue } from './../utils';

export class BaseBidder {
	constructor(bidderConfig, resetListener, timeout = 2000) {
		this.logGroup = 'bidder';
		this.bidderConfig = bidderConfig;
		this.timeout = timeout;

		this.resetState();

		if (resetListener) {
			resetListener(this.resetState);
		}

		this.onResponse = () => this.onResponseCall();
	}

	static responseCallback(callback) {
		callback();
	}

	addResponseListener(callback) {
		this.onResponseCallbacks.push(callback);
	}

	call() {
		this.response = false;

		if (this.callBids) {
			this.callBids(this.onResponse);
		}

		this.called = true;
	}

	createWithTimeout(func, msToTimeout = 2000) {
		const timeout = new Promise((resolve, reject) => {
			setTimeout(reject, msToTimeout);
		});

		return Promise.race([new Promise(func), timeout]);
	}

	getName() {
		return this.name;
	}

	getSlotBestPrice(slotName) {
		if (this.getBestPrice) {
			return this.getBestPrice(slotName);
		}

		return {};
	}

	getSlotTargetingParams(slotName, floorPrice) {
		if (!this.called || !this.isSlotSupported(slotName) || !this.getTargetingParams) {
			return {};
		}

		return this.getTargetingParams(slotName, floorPrice);
	}

	hasResponse() {
		return this.response;
	}

	isSlotSupported(slotName) {
		if (this.isSupported) {
			return this.isSupported(slotName);
		}

		return false;
	}

	onResponseCall() {
		// this.calculatePrices();
		if (this.onResponseCallbacks) {
			this.onResponseCallbacks.start();
		}

		this.response = true;
	}

	resetState() {
		this.called = false;
		this.response = false;
		this.onResponseCallbacks = [];

		makeLazyQueue(this.onResponseCallbacks, BaseBidder.responseCallback);
	}

	waitForResponse() {
		return this.createWithTimeout((resolve) => {
			if (this.hasResponse()) {
				resolve();
			} else {
				this.addResponseListener(resolve);
			}
		}, this.timeout);
	}

	wasCalled() {
		return this.called;
	}
}
