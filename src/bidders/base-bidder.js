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
	}

	static responseCallback(callback) {
		callback();
	}

	resetState() {
		this.called = false;
		this.response = false;
		this.onResponseCallbacks = [];

		makeLazyQueue(this.onResponseCallbacks, BaseBidder.responseCallback);
	}


















	onResponse() {
		// log('onResponse', 'debug', this.logGroup);
		this.calculatePrices();
		this.response = true;
		this.onResponseCallbacks.start();
	}

	addResponseListener(callback) {
		this.onResponseCallbacks.push(callback);
	}

	call() {
		// log('call', 'debug', this.logGroup);
		this.response = false;

		if (!Object.keys) {
			// log(['call', 'Module is not supported in IE8', this.name], 'debug', this.logGroup);
			return;
		}

		this.call(this.onResponse);
		this.called = true;
	}

	wasCalled() {
		// log(['wasCalled', this.called], 'debug', this.logGroup);
		return this.called;
	}

	getSlotParams(slotName, floorPrice) {
		// log(['getSlotParams', slotName, this.called, this.response], 'debug', this.logGroup);

		if (!this.called || !this.isSlotSupported(slotName)) {
			// log(['getSlotParams', 'Not called or slot is not supported', slotName], 'debug', this.logGroup);

			return {};
		}

		return this.getSlotParams(slotName, floorPrice);
	}

	getBestSlotPrice(slotName) {
		if (this.getBestSlotPrice) {
			return this.getBestSlotPrice(slotName);
		}

		return {};
	}

	getName() {
		return this.name;
	}

	hasResponse() {
		// log(['hasResponse', thisresponse], 'debug', this.logGroup);
		return this.response;
	}

	createWithTimeout(func, msToTimeout = 2000) {
		const timeout = new Promise((resolve, reject) => {
			setTimeout(reject, msToTimeout);
		});

		return Promise.race([new Promise(func), timeout]);
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
}
