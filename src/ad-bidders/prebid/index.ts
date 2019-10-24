import {
	AdSlot,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	events,
	eventService,
	pbjsFactory,
	utils,
} from '@ad-engine/core';
import { BidderConfig, BidderProvider, BidsRefreshing } from '../bidder-provider';
import { adaptersRegistry } from './adapters-registry';
import { getAvailableBidsByAdUnitCode, getBidUUID, setupAdUnits } from './prebid-helper';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

interface PrebidConfig extends BidderConfig {
	lazyLoadingEnabled?: boolean;
	[bidderName: string]: { enabled: boolean; slots: Dictionary } | boolean;
}

eventService.on(events.VIDEO_AD_IMPRESSION, markWinningVideoBidAsUsed);
eventService.on(events.VIDEO_AD_ERROR, markWinningVideoBidAsUsed);

async function markWinningVideoBidAsUsed(adSlot: AdSlot): Promise<void> {
	// Mark ad as rendered
	const adId: string = context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);

	if (adId) {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.markWinningBidAsUsed({ adId });
		eventService.emit(events.VIDEO_AD_USED, adSlot);
	}
}

const uuidKey = 'hb_uuid';

export class PrebidProvider extends BidderProvider {
	static validResponseStatusCode = 1;
	static errorResponseStatusCode = 2;

	adUnits: PrebidAdUnit[];
	isCMPEnabled: boolean;
	isLazyLoadingEnabled: boolean;
	lazyLoaded = false;
	prebidConfig: Dictionary;
	bidsRefreshing: BidsRefreshing;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.isLazyLoadingEnabled = this.bidderConfig.lazyLoadingEnabled;
		this.isCMPEnabled = context.get('custom.isCMPEnabled');
		this.adUnits = setupAdUnits(this.isLazyLoadingEnabled ? 'pre' : 'off');
		this.prebidConfig = {
			debug:
				utils.queryString.get('pbjs_debug') === '1' ||
				utils.queryString.get('pbjs_debug') === 'true',
			enableSendAllBids: false,
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			cache: {
				url: 'https://prebid.adnxs.com/pbc/v1/cache',
			},
			userSync: {
				iframeEnabled: true,
				enabledBidders: [],
				syncDelay: 6000,
			},
		};
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		if (this.isCMPEnabled) {
			this.prebidConfig.consentManagement = {
				cmpApi: 'iab',
				timeout: this.timeout,
				allowAuctionWithoutConsent: false,
			};
		}

		this.applyConfig(this.prebidConfig);
		this.registerBidsRefreshing();
	}

	async applyConfig(config: Dictionary): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		return pbjs.setConfig(config);
	}

	async applySettings(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.bidderSettings = getSettings();
	}

	protected callBids(bidsBackHandler: (...args: any[]) => void): void {
		if (!this.adUnits) {
			this.adUnits = setupAdUnits(this.isLazyLoadingEnabled ? 'pre' : 'off');
		}

		if (this.adUnits.length > 0) {
			this.applySettings();
			this.requestBids(this.adUnits, bidsBackHandler, this.removeAdUnits);
		}

		if (this.isLazyLoadingEnabled) {
			eventService.on(events.PREBID_LAZY_CALL, () => {
				this.lazyCall(bidsBackHandler);
			});
		}
	}

	lazyCall(bidsBackHandler: (...args: any[]) => void): void {
		if (this.lazyLoaded) {
			return;
		}

		this.lazyLoaded = true;

		const adUnitsLazy: PrebidAdUnit[] = setupAdUnits('post');

		if (adUnitsLazy.length > 0) {
			this.requestBids(adUnitsLazy, bidsBackHandler);

			this.adUnits = this.adUnits.concat(adUnitsLazy);
		}
	}

	async removeAdUnits(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		(pbjs.adUnits || []).forEach((adUnit) => pbjs.removeAdUnit(adUnit.code));
	}

	getBestPrice(slotName: string): Promise<Dictionary<string>> {
		const slotAlias: string = this.getSlotAlias(slotName);

		return getPrebidBestPrice(slotAlias);
	}

	getTargetingKeys(slotName: string): string[] {
		const allTargetingKeys: string[] = Object.keys(
			context.get(`slots.${slotName}.targeting`) || {},
		);

		return allTargetingKeys.filter((key) => key.indexOf('hb_') === 0);
	}

	getDealsTargetingFromBid(bid: Dictionary): PrebidTargeting {
		const keyValuePairs: Dictionary = {};

		Object.keys(bid.adserverTargeting).forEach((key) => {
			if (key.indexOf('hb_deal_') === 0) {
				keyValuePairs[key] = bid.adserverTargeting[key];
			}
		});

		return keyValuePairs;
	}

	async getTargetingParams(slotName: string): Promise<PrebidTargeting> {
		const slotAlias: string = this.getSlotAlias(slotName);
		let slotParams: PrebidTargeting = {};
		let deals: PrebidTargeting = {};

		// We are not using pbjs.getAdserverTargetingForAdUnitCode
		// because it takes only last auction into account.
		// We need to get all available bids (including old auctions)
		// in order to keep still available, not refreshed adapters' bids...
		const bids: PrebidBidResponse[] = await getAvailableBidsByAdUnitCode(slotAlias);

		if (bids.length) {
			let bidParams = null;

			bids.forEach((param) => {
				if (!bidParams) {
					bidParams = param;
				} else if (bidParams.cpm === param.cpm) {
					bidParams = bidParams.timeToRespond > param.timeToRespond ? param : bidParams;
				} else {
					bidParams = bidParams.cpm < param.cpm ? param : bidParams;
				}

				// ... However we need to take care of all hb_deal_* keys manually then
				deals = {
					...deals,
					...this.getDealsTargetingFromBid(param),
				};
			});

			if (bidParams) {
				slotParams = {
					...deals,
					...bidParams.adserverTargeting,
				};
			}
		}

		const { hb_adid: adId } = slotParams;

		if (adId) {
			const uuid: string = await getBidUUID(slotAlias, adId);

			if (uuid) {
				// This is not calculated in prebid-settings for hb_uuid
				// because AppNexus adapter is using external service to retrieve
				// cache key and adserverTargeting is executed too early.
				// We have to take it as late as possible.
				slotParams[uuidKey] = uuid;
			}
		}

		return slotParams || {};
	}

	isSupported(slotName: string): boolean {
		const slotAlias: string = this.getSlotAlias(slotName);

		return this.adUnits && this.adUnits.some((adUnit) => adUnit.code === slotAlias);
	}

	async registerBidsRefreshing(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		const refreshUsedBid = (winningBid) => {
			eventService.emit(events.BIDS_REFRESH_STARTED, winningBid.adUnitCode);
			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				eventService.emit(events.BIDS_REFRESH);
				const adUnitsToRefresh = this.adUnits.filter(
					(adUnit) =>
						adUnit.code === winningBid.adUnitCode &&
						adUnit.bids &&
						adUnit.bids[0] &&
						adUnit.bids[0].bidder === winningBid.bidderCode,
				);
				this.requestBids(adUnitsToRefresh, this.bidsRefreshing.bidsBackHandler);
			}
		};

		pbjs.onEvent('bidWon', refreshUsedBid);
		eventService.once(events.PAGE_CHANGE_EVENT, () => {
			pbjs.offEvent('bidWon', refreshUsedBid);
		});
	}

	async requestBids(
		adUnits: PrebidAdUnit[],
		bidsBackHandler: (...args: any[]) => void,
		withRemove?: () => void,
	): Promise<void> {
		if (withRemove) {
			withRemove();
		}

		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.requestBids({
			adUnits,
			bidsBackHandler,
		});
	}

	/**
	 * @inheritDoc
	 */
	calculatePrices(): void {
		return;
	}
}
