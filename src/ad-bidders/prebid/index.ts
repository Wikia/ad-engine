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
import { Cmp, cmp } from '../wrappers';
import { adaptersRegistry } from './adapters-registry';
import { getWinningBid, setupAdUnits } from './prebid-helper';
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

export class PrebidProvider extends BidderProvider {
	adUnits: PrebidAdUnit[];
	isLazyLoadingEnabled: boolean;
	lazyLoaded = false;
	cmp: Cmp = cmp;
	prebidConfig: Dictionary;
	bidsRefreshing: BidsRefreshing;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.isLazyLoadingEnabled = this.bidderConfig.lazyLoadingEnabled;
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

		if (this.cmp.exists) {
			// ToDo: remove it once Prebid v2.44.0 transition will be done
			if (context.get('bidders.prebid.libraryUrl')) {
				this.prebidConfig.consentManagement = {
					cmpApi: 'iab',
					timeout: this.timeout,
					allowAuctionWithoutConsent: false,
				};
			} else {
				this.prebidConfig.consentManagement = {
					gdpr: {
						cmpApi: 'iab',
						timeout: this.timeout,
						allowAuctionWithoutConsent: false,
					},
					usp: {
						cmpApi: 'iab',
						timeout: 100,
					},
				};
			}
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

	async getTargetingParams(slotName: string): Promise<PrebidTargeting> {
		const slotAlias: string = this.getSlotAlias(slotName);

		return getWinningBid(slotAlias);
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
