import {
	AdSlot,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	events,
	eventService,
	utils,
} from '@wikia/ad-engine';
import { decorate } from 'core-decorators';
import { BaseBidder, BidderConfig, BidsRefreshing } from '../base-bidder';
import { AdUnitConfig } from './adapters';
import { adaptersRegistry } from './adapters-registry';
import { getAvailableBidsByAdUnitCode, getBidUUID, setupAdUnits } from './prebid-helper';
import { getSettings, PrebidTargeting } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

interface PrebidConfig extends BidderConfig {
	lazyLoadingEnabled?: boolean;
	[bidderName: string]: { enabled: boolean; slots: Dictionary } | boolean;
}

export interface PrebidBid {
	cpm: number;
	status: string;
	bidderCode: string;
	timeToRespond: number;
	getStatusCode: () => number;
}

function postponeExecutionUntilPbjsLoads(method: (...T: any[]) => void): (...T) => void {
	return function (...args: any[]): void {
		return window.pbjs.que.push(() => method.apply(this, args));
	};
}

eventService.on(events.VIDEO_AD_IMPRESSION, markWinningBidAsUsed);
eventService.on(events.VIDEO_AD_ERROR, markWinningBidAsUsed);

function markWinningBidAsUsed(adSlot: AdSlot): void {
	// Mark ad as rendered
	const adId: string = context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);

	if (adId) {
		if (window.pbjs && typeof window.pbjs.markWinningBidAsUsed === 'function') {
			window.pbjs.markWinningBidAsUsed({ adId });
			eventService.emit(events.VIDEO_AD_USED, adSlot);
		}
	}
}

const logGroup = 'prebid';
const uuidKey = 'hb_uuid';

let loaded = false;

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

export class Prebid extends BaseBidder {
	static validResponseStatusCode = 1;
	static errorResponseStatusCode = 2;

	adUnits: AdUnitConfig[];
	isCMPEnabled: boolean;
	isLazyLoadingEnabled: boolean;
	lazyLoaded = false;
	prebidConfig: Dictionary;
	bidsRefreshing: BidsRefreshing;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);

		this.insertScript();
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

		window.pbjs = window.pbjs || {};
		window.pbjs.que = window.pbjs.que || [];

		this.applyConfig(this.prebidConfig);

		if (this.bidsRefreshing.enabled) {
			this.registerBidsRefreshing();
		}
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	applyConfig(config: Dictionary): void {
		window.pbjs.setConfig(config);
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	applySettings(): void {
		window.pbjs.bidderSettings = getSettings();
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

	private insertScript(): void {
		if (loaded) {
			return;
		}

		const libraryUrl = context.get('bidders.prebid.libraryUrl');

		if (!libraryUrl) {
			utils.logger(
				logGroup,
				'Prebid library URL not defined. Assuming that window.pbjs will be loaded.',
			);

			return;
		}

		utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
		loaded = true;
	}

	lazyCall(bidsBackHandler: (...args: any[]) => void): void {
		if (this.lazyLoaded) {
			return;
		}

		this.lazyLoaded = true;

		const adUnitsLazy: AdUnitConfig[] = setupAdUnits('post');

		if (adUnitsLazy.length > 0) {
			this.requestBids(adUnitsLazy, bidsBackHandler);

			this.adUnits = this.adUnits.concat(adUnitsLazy);
		}
	}

	removeAdUnits(): void {
		(window.pbjs.adUnits || []).forEach((adUnit) => {
			window.pbjs.removeAdUnit(adUnit.code);
		});
	}

	getBestPrice(slotName: string): Dictionary<string> {
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

	getTargetingParams(slotName: string): PrebidTargeting {
		const slotAlias: string = this.getSlotAlias(slotName);
		let slotParams: PrebidTargeting = {};
		let deals: PrebidTargeting = {};

		// We are not using pbjs.getAdserverTargetingForAdUnitCode
		// because it takes only last auction into account.
		// We need to get all available bids (including old auctions)
		// in order to keep still available, not refreshed adapters' bids...
		const bids: PrebidBid[] = getAvailableBidsByAdUnitCode(slotAlias);

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
			const uuid: string = getBidUUID(slotAlias, adId);

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

	registerBidsRefreshing(): void {
		window.pbjs.que.push(() => {
			const refreshUsedBid = (winningBid) => {
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

			window.pbjs.onEvent('bidWon', refreshUsedBid);
			eventService.once(events.PAGE_CHANGE_EVENT, () => {
				window.pbjs.offEvent('bidWon', refreshUsedBid);
			});
		});
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	requestBids(
		adUnits: AdUnitConfig[],
		bidsBackHandler: (...args: any[]) => void,
		withRemove?: () => void,
	): void {
		if (withRemove) {
			withRemove();
		}

		window.pbjs.requestBids({
			adUnits,
			bidsBackHandler,
		});
	}

	/**
	 * @inheritDoc
	 */
	calculatePrices() {
		return null;
	}
}
