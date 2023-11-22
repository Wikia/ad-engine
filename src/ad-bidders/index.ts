import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	AdSlotEvent,
	BaseServiceSetup,
	context,
	Dictionary,
	InstantConfigService,
	SlotPriceProvider,
	targetingService,
	utils,
} from '@ad-engine/core';
import { A9Provider } from './a9';
import { getSlotBidGroup } from './bidder-helper';
import { PrebidProvider } from './prebid';

interface BiddersProviders {
	a9?: A9Provider;
	prebid?: PrebidProvider;
}

const logGroup = 'bidders';

export class Bidders extends BaseServiceSetup implements SlotPriceProvider {
	private biddersProviders: { [key: string]: BiddersProviders } = {};
	private realSlotPrices = {};

	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
	) {
		super(instantConfig, globalTimeout);

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

		communicationService.on(
			eventsRepository.BIDDERS_CALL_PER_GROUP,
			({ group, callback }) => {
				this.callByBidGroup(group).then(() => {
					utils.logger(logGroup, `${group} - callback`);
					callback();
				});
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

	getBiddersProviders(group: string | undefined = undefined): (A9Provider | PrebidProvider)[] {
		return Object.values(this.biddersProviders[group] || {});
	}

	getBidderProviders(group: string | undefined = undefined): BiddersProviders {
		return this.biddersProviders[group] || {};
	}

	async getBidParameters(slotName): Promise<Dictionary> {
		const slotParams = {};
		const slotBidGroup = getSlotBidGroup(slotName);

		await Promise.all(
			this.getBiddersProviders(slotBidGroup).map(async (provider) => {
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
		const slotBidGroup = getSlotBidGroup(slotName);

		await Promise.all(
			this.getBiddersProviders(slotBidGroup).map(async (provider) => {
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
		const slotBidGroup = getSlotBidGroup(slotName);

		this.getBiddersProviders(slotBidGroup).forEach((provider) => {
			provider.getTargetingKeys(slotName).forEach((key) => {
				targetingService.remove(key, slotName);
			});
		});

		utils.logger(logGroup, 'resetTargetingKeys', slotName);
	}

	call(): Promise<void> {
		return this.callByBidGroup(undefined);
	}

	callByBidGroup(group: string | undefined): Promise<void> {
		const config = context.get('bidders') || {};
		const promise = utils.createExtendedPromise();

		this.biddersProviders[group] = this.biddersProviders[group] || {};

		if (config.prebid && config.prebid.enabled) {
			this.biddersProviders[group].prebid = new PrebidProvider(
				config.prebid,
				config.timeout,
				group,
			);
		}

		if (A9Provider.isEnabled()) {
			this.biddersProviders[group].a9 = new A9Provider(config.a9, config.timeout, group);
		} else {
			utils.logger(logGroup, `${group} - A9 has been disabled`);
		}

		if (!this.getBiddersProviders(group).length) {
			utils.logger(logGroup, `${group} - resolving call() promise because of no bidder providers`);
			return Promise.resolve();
		}

		this.getBiddersProviders(group).forEach((provider) => {
			provider.addResponseListener(() => {
				if (this.hasAllResponses(group)) {
					utils.logger(
						logGroup,
						`${group} - ${provider.name} - resolving call() promise because of having all responses`,
					);
					promise.resolve(null);
				}
			});

			provider.call();
		});

		utils.logger(logGroup, `${group} - returning call() promise`);
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

	private hasAllResponses(group: string | undefined = undefined): boolean {
		const missingProviders = Object.keys(this.biddersProviders).filter((providerName) => {
			const provider = this.getBidderProviders(group)[providerName];

			if (!provider) {
				return false;
			}

			return !provider.hasResponse();
		});

		return missingProviders.length === 0;
	}
}

export * from './prebid/ats';
export * from './prebid/intent-iq';
export * from './prebid/native';
export * from './wrappers';
