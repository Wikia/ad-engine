import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	AdSlotEvent,
	context,
	Dictionary,
	InstantConfigService,
	SlotPriceProvider,
	targetingService,
} from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { createExtendedPromise, GlobalTimeout, logger } from '@ad-engine/utils';
import { A9Provider } from './a9';
import { defaultSlotBidGroup, getSlotBidGroupByName } from './bidder-helper';
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
		protected globalTimeout: GlobalTimeout,
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
					logger(logGroup, `${group} - callback`);
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

	async getBidParameters(slotName): Promise<Dictionary> {
		const slotParams = {};
		const slotBidGroup = getSlotBidGroupByName(slotName);

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
		const slotBidGroup = getSlotBidGroupByName(slotName);

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
		const slotBidGroup = getSlotBidGroupByName(slotName);

		this.getBiddersProviders(slotBidGroup).forEach((provider) => {
			provider.getTargetingKeys(slotName).forEach((key) => {
				targetingService.remove(key, slotName);
			});
		});

		logger(logGroup, 'resetTargetingKeys', slotName);
	}

	call(): Promise<void> {
		return this.callByBidGroup(defaultSlotBidGroup);
	}

	callByBidGroup(group: string): Promise<void> {
		const config = context.get('bidders') || {};
		const promise = createExtendedPromise();

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
			logger(logGroup, `Group: ${group} - A9 has been disabled`);
		}

		if (!this.getBiddersProviders(group).length) {
			logger(logGroup, `Group: ${group} - resolving call() promise because of no bidder providers`);
			return Promise.resolve();
		}

		this.getBiddersProviders(group).forEach((provider) => {
			provider.addResponseListener(() => {
				if (this.hasAllResponses(group)) {
					logger(
						logGroup,
						`Group: ${group} - ${provider.name} - resolving call() promise because of having all responses`,
					);
					promise.resolve(null);
				}
			});

			provider.call();
		});

		logger(logGroup, `Group: ${group} - returning call() promise`);
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

		logger(logGroup, 'updateSlotTargeting', slotName, bidderTargeting);
		communicationService.emit(eventsRepository.BIDDERS_BIDDING_DONE, {
			slotName,
			provider: 'prebid',
		});

		return bidderTargeting;
	}

	private hasAllResponses(bidGroup: string): boolean {
		const missingProviders = Object.keys(this.getBidderProviders(bidGroup)).filter(
			(providerName) => {
				const provider = this.getBidderProviders(bidGroup)[providerName];

				if (!provider) {
					return false;
				}

				return !provider.hasResponse();
			},
		);

		return missingProviders.length === 0;
	}

	private getBiddersProviders(bidGroup: string): (A9Provider | PrebidProvider)[] {
		return Object.values(this.biddersProviders[bidGroup] || {});
	}

	private getBidderProviders(bidGroup: string): BiddersProviders {
		return this.biddersProviders[bidGroup] || {};
	}
}

export * from './a9/index';
export * from './prebid/intent-iq';
export * from './prebid/liveramp-id';
export * from './prebid/native';
export * from './wrappers';
