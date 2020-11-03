import {
	AdSlot,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	events,
	eventService,
	pbjsFactory,
	Tcf,
	tcf,
	utils,
} from '@ad-engine/core';
import { TrackingBidDefinition } from '@ad-engine/tracking';
import { getSlotNameByBidderAlias } from '../alias-helper';
import { BidderConfig, BidderProvider, BidsRefreshing } from '../bidder-provider';
import { adaptersRegistry } from './adapters-registry';
import { liveRamp } from './live-ramp';
import { getWinningBid, setupAdUnits } from './prebid-helper';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

const logGroup = 'prebid';

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
	tcf: Tcf = tcf;
	prebidConfig: Dictionary;
	bidsRefreshing: BidsRefreshing;
	isATSAnalyticsEnabled = false;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.isLazyLoadingEnabled = this.bidderConfig.lazyLoadingEnabled;
		this.adUnits = setupAdUnits(this.isLazyLoadingEnabled ? 'pre' : 'off');
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};
		this.isATSAnalyticsEnabled = context.get('bidders.liveRampATSAnalytics.enabled');

		this.prebidConfig = {
			debug: ['1', 'true'].includes(utils.queryString.get('pbjs_debug')),
			enableSendAllBids: !!context.get('bidders.prebid.sendAllBids'),
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			cache: {
				url: 'https://prebid.adnxs.com/pbc/v1/cache',
			},
			userSync: {
				filterSettings: {
					iframe: {
						bidders: '*',
						filter: 'include',
					},
					image: {
						bidders: '*',
						filter: 'include',
					},
				},
				syncsPerBidder: 3,
				syncDelay: 6000,
			},
		};

		this.prebidConfig = { ...this.prebidConfig, ...liveRamp.getConfig() };

		if (this.tcf.exists) {
			this.prebidConfig.consentManagement = {
				gdpr: {
					cmpApi: 'iab',
					timeout: this.timeout,
					allowAuctionWithoutConsent: false,
					defaultGdprScope: false,
				},
				usp: {
					cmpApi: 'iab',
					timeout: 100,
				},
			};
		}

		this.applyConfig(this.prebidConfig);
		this.registerBidsRefreshing();
		this.registerBidsTracking();
		this.getLiveRampUserIds();
		this.enableATSAnalytics();

		utils.logger(logGroup, 'prebid created', this.prebidConfig);
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
		const pbjs: Pbjs = await pbjsFactory.init();
		const slotAlias: string = this.getSlotAlias(slotName);

		return {
			...(context.get('bidders.prebid.sendAllBids')
				? pbjs.getAdserverTargetingForAdUnitCode(slotAlias)
				: null),
			...(await getWinningBid(slotAlias)),
		};
	}

	isSupported(slotName: string): boolean {
		const slotAlias: string = this.getSlotAlias(slotName);

		return this.adUnits && this.adUnits.some((adUnit) => adUnit.code === slotAlias);
	}

	async registerBidsRefreshing(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		const refreshUsedBid = (winningBid) => {
			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				eventService.emit(events.BIDS_REFRESH, [winningBid.adUnitCode]);
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

	async registerBidsTracking(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		const trackBid = (response) => {
			eventService.emit(events.BIDS_RESPONSE, this.mapResponseToTrackingBidDefinition(response));
		};

		pbjs.onEvent('bidResponse', trackBid);
		eventService.once(events.PAGE_CHANGE_EVENT, () => {
			pbjs.offEvent('bidResponse', trackBid);
		});
	}

	private mapResponseToTrackingBidDefinition(response: PrebidBidResponse): TrackingBidDefinition {
		return {
			bidderName: response.bidderCode,
			price: response.cpm.toString(),
			responseTimestamp: response.responseTimestamp,
			slotName: getSlotNameByBidderAlias(response.adUnitCode),
			size: response.size,
			timeToRespond: response.timeToRespond,
		};
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

	async getLiveRampUserIds(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		if (pbjs.getUserIds) {
			const userId = pbjs.getUserIds()['idl_env'];

			utils.logger(logGroup, 'calling LiveRamp dispatch method');

			liveRamp.dispatchLiveRampPrebidIdsLoadedEvent(userId);
		}
	}

	private enableATSAnalytics(): void {
		if (this.isATSAnalyticsEnabled) {
			utils.logger(logGroup, 'prebid enabling ATS Analytics');

			(window as any).pbjs.que.push(() => {
				(window as any).pbjs.enableAnalytics([
					{
						provider: 'atsAnalytics',
						options: {
							pid: '2161',
							host: 'https://analytics.openlog.in',
						},
					},
				]);
			});
		}
	}

	/**
	 * @inheritDoc
	 */
	calculatePrices(): void {
		return;
	}
}
