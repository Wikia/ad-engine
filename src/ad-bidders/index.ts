import { context, Dictionary, events, eventService, utils } from '@ad-engine/core';
import { A9Provider } from './a9';
import { PrebidProvider } from './prebid';

interface BiddersProviders {
	a9?: A9Provider;
	prebid?: PrebidProvider;
}

const logGroup = 'bidders';

class Bidders {
	private biddersProviders: BiddersProviders = {};
	private realSlotPrices = {};

	constructor() {
		eventService.on(events.VIDEO_AD_REQUESTED, (adSlot) => {
			adSlot.updateWinningPbBidderDetails();
		});

		eventService.on(events.VIDEO_AD_USED, (adSlot) => {
			this.updateSlotTargeting(adSlot.getSlotName());
		});
	}

	getName(): string {
		return 'bidders';
	}

	isEnabled(): boolean {
		return context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled');
	}

	applyTargetingParams(slotName, targeting): void {
		Object.keys(targeting).forEach((key) =>
			context.set(`slots.${slotName}.targeting.${key}`, targeting[key]),
		);
	}

	getBiddersProviders(): (A9Provider | PrebidProvider)[] {
		return Object.values(this.biddersProviders);
	}

	async getBidParameters(slotName): Promise<Dictionary> {
		const slotParams = {};

		await Promise.all(
			this.getBiddersProviders().map(async (provider) => {
				if (provider && provider.wasCalled()) {
					const params = await provider.getSlotTargetingParams(slotName);

					Object.assign(slotParams, params);
				}
			}),
		);

		return slotParams;
	}

	async getCurrentSlotPrices(slotName): Promise<Dictionary<string>> {
		const slotPrices = {};

		await Promise.all(
			this.getBiddersProviders().map(async (provider) => {
				if (provider && provider.isSlotSupported(slotName)) {
					const priceFromBidder = await provider.getSlotBestPrice(slotName);

					Object.keys(priceFromBidder).forEach((adapterName) => {
						slotPrices[adapterName] = priceFromBidder[adapterName];
					});
				}
			}),
		);

		return slotPrices;
	}

	getDfpSlotPrices(slotName): Dictionary<string> {
		return this.realSlotPrices[slotName] || {};
	}

	resetTargetingKeys(slotName): void {
		this.getBiddersProviders().forEach((provider) => {
			provider.getTargetingKeys(slotName).forEach((key) => {
				context.remove(`slots.${slotName}.targeting.${key}`);
			});
		});

		utils.logger(logGroup, 'resetTargetingKeys', slotName);
	}

	requestBids(): Promise<void> {
		const config = context.get('bidders') || {};
		const promise = utils.createExtendedPromise();

		if (config.prebid && config.prebid.enabled) {
			this.biddersProviders.prebid = new PrebidProvider(config.prebid, config.timeout);
		}

		if (config.a9 && config.a9.enabled) {
			this.biddersProviders.a9 = new A9Provider(config.a9, config.timeout);
		}

		if (!this.getBiddersProviders().length) {
			return Promise.resolve();
		}

		this.getBiddersProviders().forEach((provider) => {
			provider.addResponseListener(() => {
				if (this.hasAllResponses()) {
					promise.resolve();
				}
			});

			provider.call();
		});

		return promise;
	}

	async storeRealSlotPrices(slotName): Promise<void> {
		this.realSlotPrices[slotName] = await this.getCurrentSlotPrices(slotName);
	}

	async updateSlotTargeting(slotName): Promise<Dictionary> {
		const bidderTargeting = await this.getBidParameters(slotName);

		await this.storeRealSlotPrices(slotName);

		this.resetTargetingKeys(slotName);
		this.applyTargetingParams(slotName, bidderTargeting);

		utils.logger(logGroup, 'updateSlotTargeting', slotName, bidderTargeting);

		return bidderTargeting;
	}

	private hasAllResponses(): boolean {
		const missingProviders = Object.keys(this.biddersProviders).filter((providerName) => {
			const provider = this.biddersProviders[providerName];

			return !provider.hasResponse();
		});

		return missingProviders.length === 0;
	}
}

export const bidders = new Bidders();

export * from './tracking';
export * from './wrappers';
