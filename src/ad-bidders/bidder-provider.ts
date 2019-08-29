import { context, DEFAULT_MAX_DELAY, Dictionary, utils } from '@ad-engine/core';
import { LazyQueue } from '../ad-engine/utils';

export interface BidderConfig {
	enabled: boolean;
}

export interface BidsRefreshing {
	enabled: boolean;
	slots: string[];
	bidsBackHandler: (...args: any[]) => void;
}

export abstract class BidderProvider {
	logGroup: string;
	called = false;
	w;
	response = false;
	onResponseCallbacks: LazyQueue;

	protected constructor(
		public name: string,
		public bidderConfig: BidderConfig,
		public timeout: number = DEFAULT_MAX_DELAY,
	) {
		this.logGroup = `${name}-bidder`;
		this.resetState();
		utils.logger(this.logGroup, 'created');
	}

	resetState(): void {
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

	getSlotBestPrice(slotName: string): Promise<Dictionary<number | string>> {
		return this.getBestPrice(slotName);
	}

	getSlotTargetingParams(slotName: string): Promise<Dictionary> {
		if (!this.called || !this.isSlotSupported(slotName)) {
			return Promise.resolve({});
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

	protected abstract callBids(cb?: (...args: any[]) => any): void;

	protected abstract calculatePrices(): void;

	protected abstract getBestPrice(slotName: string): Promise<Dictionary<number | string>>;

	protected abstract getTargetingParams(slotName: string): Promise<Dictionary>;

	protected abstract isSupported(slotName: string): boolean;
}
