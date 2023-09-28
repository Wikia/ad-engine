import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	AdSlotEvent,
	BaseServiceSetup,
	context,
	Dictionary,
	SlotPriceProvider,
	targetingService,
	utils,
} from '@ad-engine/core';
import { A9Provider } from './a9';
import { PrebidProvider } from './prebid';

interface BiddersProviders {
	a9?: A9Provider;
	prebid?: PrebidProvider;
}

const logGroup = 'bidders';

export class Bidders extends BaseServiceSetup implements SlotPriceProvider {
	static biddersProviders: BiddersProviders = {};
	private realSlotPrices = {};

	constructor() {
		super();

		communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_REQUESTED, ({ slot }) => {
			slot.updateWinningPbBidderDetails();
		});
		communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_USED, ({ slot }) => {
			this.updateSlotTargeting(slot.getSlotName());
		});
		communicationService.on(
			eventsRepository.BIDDERS_BIDS_REFRESH,
			({ refreshedSlotNames }) => {
				refreshedSlotNames.forEach((slotName) => this.updateSlotTargeting(slotName));
			},
			false,
		);
	}

	getName(): string {
		return 'bidders';
	}

	isEnabled(): boolean {
		return context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled');
	}

	applyTargetingParams(slotName, targeting): void {
		Object.keys(targeting).forEach((key) => targetingService.set(key, targeting[key], slotName));
	}

	getBiddersProviders(): (A9Provider | PrebidProvider)[] {
		return Object.values(Bidders.biddersProviders);
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
				targetingService.remove(key, slotName);
			});
		});

		utils.logger(logGroup, 'resetTargetingKeys', slotName);
	}

	call(): Promise<void> {
		const promise = utils.createExtendedPromise();

		if (!this.getBiddersProviders().length) {
			utils.logger(logGroup, 'resolving call() promise because of no bidder providers');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'add response listeners', Bidders.biddersProviders);

		this.getBiddersProviders().forEach((provider) => {
			provider.addResponseListener(() => {
				if (this.hasAllResponses()) {
					utils.logger(logGroup, 'resolving call() promise because of having all responses');
					promise.resolve(null);
				}
			});

			provider.call();
		});

		utils.logger(logGroup, 'returning call() promise');
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
		communicationService.emit(eventsRepository.BIDDERS_BIDDING_DONE, {
			slotName,
			provider: 'prebid',
		});

		return bidderTargeting;
	}

	private hasAllResponses(): boolean {
		const missingProviders = Object.keys(Bidders.biddersProviders).filter((providerName) => {
			const provider = Bidders.biddersProviders[providerName];

			return !provider.hasResponse();
		});

		return missingProviders.length === 0;
	}
}

export * from './a9/a9-runner';
export * from './prebid/intent-iq';
export * from './prebid/native';
export * from './prebid/prebid-runner';
export * from './wrappers';
