import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import {
	AdSlot,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	pbjsFactory,
	Tcf,
	tcf,
	utils,
} from '@ad-engine/core';
import { getSlotNameByBidderAlias } from '../alias-helper';
import { BidderConfig, BidderProvider, BidsRefreshing } from '../bidder-provider';
import { adaptersRegistry } from './adapters-registry';
import { ats } from './ats';
import { liveRamp } from './live-ramp';
import { getWinningBid, setupAdUnits } from './prebid-helper';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

const logGroup = 'prebid';

interface PrebidConfig extends BidderConfig {
	lazyLoadingEnabled?: boolean;
	[bidderName: string]: { enabled: boolean; slots: Dictionary } | boolean;
}

communicationService.onSlotEvent(AdSlot.VIDEO_AD_IMPRESSION, ({ slot }) =>
	markWinningVideoBidAsUsed(slot),
);
communicationService.onSlotEvent(AdSlot.VIDEO_AD_ERROR, ({ slot }) =>
	markWinningVideoBidAsUsed(slot),
);

async function markWinningVideoBidAsUsed(adSlot: AdSlot): Promise<void> {
	// Mark ad as rendered
	const adId: string = context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);

	if (adId) {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.markWinningBidAsUsed({ adId });
		adSlot.emit(AdSlot.VIDEO_AD_USED);
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
			enableSendAllBids: true,
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

		this.prebidConfig = {
			...this.prebidConfig,
			...this.configureLiveRamp(),
			...this.configureTCF(),
			...this.configureJWPlayerDataProvider(),
		};

		this.applyConfig(this.prebidConfig);

		this.configureAdUnits();

		this.registerBidsRefreshing();
		this.registerBidsTracking();
		this.getLiveRampUserIds();
		this.enableATSAnalytics();

		utils.logger(logGroup, 'prebid created', this.prebidConfig);
	}

	private configureLiveRamp(): object {
		return liveRamp.getConfig();
	}

	private configureTCF(): object {
		if (this.tcf.exists) {
			return {
				consentManagement: {
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
				},
			};
		}

		return {};
	}

	private configureJWPlayerDataProvider(): object {
		if (!context.get('custom.jwplayerDataProvider')) {
			return {};
		}

		const jwplayerDataProvider = {
			name: 'jwplayer',
			waitForIt: true,
			params: {
				mediaIDs: [],
			},
		};

		if (context.get('wiki.targeting.featuredVideo.mediaId')) {
			jwplayerDataProvider.params.mediaIDs.push(
				context.get('wiki.targeting.featuredVideo.mediaId'),
			);
		}

		return {
			realTimeData: {
				auctionDelay: 500,
				dataProviders: [jwplayerDataProvider],
			},
		};
	}

	async configureAdUnits(): Promise<void> {
		await pbjsFactory.init();

		if (!this.adUnits) {
			this.adUnits = setupAdUnits(this.isLazyLoadingEnabled ? 'pre' : 'off');
		}
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
			communicationService.on(
				eventsRepository.BIDDERS_PREBID_LAZY_CALL,
				() => {
					this.lazyCall(bidsBackHandler);
				},
				false,
			);
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
			...pbjs.getAdserverTargetingForAdUnitCode(slotAlias),
			...(await getWinningBid(slotAlias)),
		};
	}

	isSupported(slotName: string): boolean {
		const slotAlias: string = this.getSlotAlias(slotName);

		return this.adUnits && this.adUnits.some((adUnit) => adUnit.code === slotAlias);
	}

	async registerBidsRefreshing(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		const refreshUsedBid = (winningBid) => {
			if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
				communicationService.emit(eventsRepository.BIDDERS_BIDS_REFRESH, {
					refreshedSlotNames: [winningBid.adUnitCode],
				});

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
	}

	async registerBidsTracking(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		const trackBid = (response) => {
			communicationService.emit(eventsRepository.BIDDERS_BIDS_RESPONSE, {
				bidResponse: this.mapResponseToTrackingBidDefinition(response),
			});
		};

		pbjs.onEvent('bidResponse', trackBid);
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
		ats.call();

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
