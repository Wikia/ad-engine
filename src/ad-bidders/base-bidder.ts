import { context, DEFAULT_MAX_DELAY, Dictionary, utils } from '@wikia/ad-engine';
import { LazyQueue } from '../ad-engine/utils';

export interface BidderConfig {
	enabled: boolean;
}

/**
 * @abstract
 */
export class BaseBidder {
	logGroup: string;
	called = false;
	response = false;
	onResponseCallbacks: LazyQueue;

	constructor(
		public name: string,
		public bidderConfig: BidderConfig,
		public timeout: number = DEFAULT_MAX_DELAY,
	) {
		this.logGroup = `${name}-bidder`;
		this.resetState();
		utils.logger(this.logGroup, 'created');
	}

	resetState() {
		this.called = false;
		this.response = false;

		this.onResponseCallbacks = new utils.LazyQueue();
		this.onResponseCallbacks.onItemFlush((callback) => {
			callback(this.name);
		});
	}

	call(): void {
		this.response = false;
		this.called = true;

		this.callBids(() => this.onBidResponse());

		utils.logger(this.logGroup, 'called');
	}

	protected onBidResponse(): void {
		this.response = true;

		this.calculatePrices();
		this.onResponseCallbacks.flush();

		utils.logger(this.logGroup, 'respond');
	}

	/**
	 * Returns bidder slot alias if available, otherwise slot name
	 */
	protected getSlotAlias(slotName: string): string {
		return context.get(`slots.${slotName}.bidderAlias`) || slotName;
	}

	getSlotBestPrice(slotName: string): Dictionary<number | string> {
		return this.getBestPrice(slotName);
	}

	getSlotTargetingParams(slotName: string): Dictionary {
		if (!this.called || !this.isSlotSupported(slotName)) {
			return {};
		}

		return this.getTargetingParams(slotName);
	}

	isSlotSupported(slotName: string): boolean {
		return this.isSupported(slotName);
	}

	/**
	 * Fires the Promise if bidder replied or timeout is reached
	 */
	waitForResponse(): Promise<void> {
		return utils.createWithTimeout((resolve) => {
			if (this.hasResponse()) {
				resolve();
			} else {
				this.addResponseListener(resolve);
			}
		}, this.timeout);
	}

	hasResponse(): boolean {
		return this.response;
	}

	addResponseListener(callback: (...args: any[]) => void): void {
		this.onResponseCallbacks.push(callback);
	}

	/**
	 * Check if bidder was called
	 */
	wasCalled(): boolean {
		return this.called;
	}

	/**
	 * @abstract
	 */
	protected callBids(cb?: (...args: any[]) => any): void {
		throw new utils.NotImplementedException({ cb });
	}

	/**
	 * @abstract
	 */
	protected calculatePrices(): void {
		throw new utils.NotImplementedException();
	}

	/**
	 * @abstract
	 */
	protected getBestPrice(slotName: string): Dictionary<number | string> {
		throw new utils.NotImplementedException({ slotName });
	}

	/**
	 * @abstract
	 */
	protected getTargetingParams(slotName: string): Dictionary {
		throw new utils.NotImplementedException({ slotName });
	}

	/**
	 * Checks if slot with given name is supported by bidder.
	 * @abstract
	 */
	protected isSupported(slotName: string): boolean {
		throw new utils.NotImplementedException({ slotName });
	}
}

export interface BidsRefreshing {
	enabled: boolean;
	slots: string[];
	bidsBackHandler: (...args: any[]) => void;
}
