import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import {
	AdSlot,
	config,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	pbjsFactory,
	targetingService,
	Tcf,
	tcf,
	utils,
} from '@ad-engine/core';
import { getSlotNameByBidderAlias } from '../alias-helper';
import { BidderConfig, BidderProvider, BidsRefreshing } from '../bidder-provider';
import { adaptersRegistry } from './adapters-registry';
import { liveRamp } from './live-ramp';
import { getWinningBid, setupAdUnits } from './prebid-helper';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

const logGroup = 'prebid';

interface PrebidConfig extends BidderConfig {
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
	const adId: string = targetingService.get('hb_adid', adSlot.getSlotName());

	if (adId) {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.markWinningBidAsUsed({ adId });
		adSlot.emit(AdSlot.VIDEO_AD_USED);
	}
}

export class PrebidProvider extends BidderProvider {
	adUnits: PrebidAdUnit[];
	tcf: Tcf = tcf;
	prebidConfig: Dictionary;
	bidsRefreshing: BidsRefreshing;
	isATSAnalyticsEnabled = false;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.adUnits = setupAdUnits();
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};
		this.isATSAnalyticsEnabled = context.get('bidders.liveRampATSAnalytics.enabled');

		this.prebidConfig = {
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			cache: {
				url: 'https://prebid.adnxs.com/pbc/v1/cache',
			},
			debug: ['1', 'true'].includes(utils.queryString.get('pbjs_debug')),
			enableSendAllBids: true,
			rubicon: {
				singleRequest: true,
			},
			sendBidsControl: {
				bidLimit: 2,
				dealPrioritization: true,
			},
			targetingControls: {
				alwaysIncludeDeals: true,
				allowTargetingKeys: ['AD_ID', 'PRICE_BUCKET', 'UUID', 'SIZE', 'DEAL'],
				allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET', 'UUID', 'SIZE', 'DEAL'],
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

		if (config.rollout.coppaFlag().prebid && utils.targeting.isWikiDirectedAtChildren()) {
			this.prebidConfig.coppa = true;
		}

		if (context.get('bidders.prebid.rubicon_pg.enabled')) {
			this.prebidConfig.s2sConfig = {
				accountId: '7450',
				bidders: ['pgRubicon'],
				coopSync: true,
				defaultVendor: 'rubicon',
				enabled: true,
				extPrebid: {
					aliases: {
						pgRubicon: 'rubicon',
					},
					aliasgvlids: { pgRubicon: 52 },
				},
				timeout: Math.round(this.timeout * 0.75),
				userSyncLimit: 1,
			};
		}

		this.prebidConfig = {
			...this.prebidConfig,
			...this.configureLiveRamp(),
			...this.configureTCF(),
		};

		this.applyConfig(this.prebidConfig);
		this.configureAdUnits();
		this.registerBidsRefreshing();
		this.registerBidsTracking();
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

	async configureAdUnits(adUnits: PrebidAdUnit[] = []): Promise<void> {
		await pbjsFactory.init();

		if (adUnits.length) {
			this.adUnits = adUnits;
		} else if (!this.adUnits) {
			this.adUnits = setupAdUnits();
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
			this.adUnits = setupAdUnits();
		}

		if (this.adUnits.length === 0) {
			return;
		}

		this.applySettings();
		this.removeAdUnits();
		this.requestBids(this.adUnits, () => {
			bidsBackHandler();
			communicationService.emit(eventsRepository.BIDDERS_AUCTION_DONE);
		});

		communicationService.emit(eventsRepository.BIDDERS_BIDS_CALLED);
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
		const allTargetingKeys: string[] = Object.keys(targetingService.dumpTargeting(slotName) || {});

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
		timeout: number = this.timeout,
	): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.requestBids({
			adUnits,
			bidsBackHandler,
			timeout,
		});
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
