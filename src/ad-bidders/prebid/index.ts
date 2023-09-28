import {
	communicationService,
	eventsRepository,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import {
	AdSlot,
	AdSlotEvent,
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
import { id5 } from './id5';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice, roundBucketCpm } from './price-helper';

const logGroup = 'prebid';

const displayGranularity = {
	buckets: [
		{
			max: 5,
			increment: 0.01,
		},
		{
			max: 10,
			increment: 0.1,
		},
		{
			max: 20,
			increment: 0.5,
		},
		{
			max: 50,
			increment: 1,
		},
	],
};

const videoGranularity = {
	buckets: [
		{
			max: 10,
			increment: 0.01,
		},
		{
			max: 20,
			increment: 0.5,
		},
		{
			max: 50,
			increment: 1,
		},
	],
};

const s2sRubiconAccountId = 7450;

interface PrebidConfig extends BidderConfig {
	[bidderName: string]: { enabled: boolean; slots: Dictionary } | boolean;
}

export interface UserIdConfig {
	name: string;
	params: object;
	storage: object;
}

communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, ({ slot }) =>
	markWinningVideoBidAsUsed(slot),
);
communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_ERROR, ({ slot }) =>
	markWinningVideoBidAsUsed(slot),
);

async function markWinningVideoBidAsUsed(adSlot: AdSlot): Promise<void> {
	// Mark ad as rendered
	const adId: string = targetingService.get('hb_adid', adSlot.getSlotName());

	if (adId) {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.markWinningBidAsUsed({ adId });
		adSlot.emit(AdSlotEvent.VIDEO_AD_USED);
	}
}

export class PrebidProvider extends BidderProvider {
	adUnits: PrebidAdUnit[];
	bidsRefreshing: BidsRefreshing;
	prebidConfig: Dictionary;
	tcf: Tcf = tcf;

	constructor(public bidderConfig: PrebidConfig, public timeout = DEFAULT_MAX_DELAY) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.adUnits = adaptersRegistry.setupAdUnits();
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		this.prebidConfig = {
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			cache: {
				url: 'https://prebid.adnxs.com/pbc/v1/cache',
			},
			debug: ['1', 'true'].includes(utils.queryString.get('pbjs_debug')),
			cpmRoundingFunction: roundBucketCpm,
			mediaTypePriceGranularity: {
				banner: displayGranularity,
				video: videoGranularity,
				'video-outstream': videoGranularity,
			},
			rubicon: {
				singleRequest: true,
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
				userIds: [],
				auctionDelay: context.get('bidders.prebid.auctionDelay') || 50,
				syncsPerBidder: 3,
				syncDelay: 6000,
			},
		};

		if (utils.isCoppaSubject()) {
			this.prebidConfig.coppa = true;
		}

		this.prebidConfig = {
			...this.prebidConfig,
			...this.configureTargeting(),
			...this.configureTCF(),
			...this.configureS2sBidding(),
		};

		this.configureUserSync();

		this.applyConfig(this.prebidConfig);
		this.configureAdUnits();
		this.registerBidsRefreshing();
		this.registerBidsTracking();

		utils.logger(logGroup, 'prebid created', this.prebidConfig);
	}

	private configureTargeting(): object {
		if (context.get('bidders.prebid.disableSendAllBids')) {
			return {
				enableSendAllBids: false,
				targetingControls: {
					alwaysIncludeDeals: true,
					allowTargetingKeys: ['AD_ID', 'BIDDER', 'DEAL', 'PRICE_BUCKET', 'SIZE', 'UUID'],
				},
			};
		}

		return {
			enableSendAllBids: true,
			sendBidsControl: {
				bidLimit: 2,
				dealPrioritization: true,
			},
			targetingControls: {
				alwaysIncludeDeals: true,
				allowTargetingKeys: ['AD_ID', 'BIDDER', 'PRICE_BUCKET', 'UUID', 'SIZE', 'DEAL'],
				allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET', 'UUID', 'SIZE', 'DEAL'],
			},
		};
	}

	private configureUserSync(): void {
		this.configureOzone();
		this.configureId5();
	}

	private configureOzone(): void {
		if (context.get('bidders.prebid.ozone')) {
			this.prebidConfig.userSync.userIds.push({
				name: 'pubCommonId',
				storage: {
					type: 'cookie',
					name: '_pubcid',
					expires: 365,
				},
			});
		}
	}

	private async configureId5(): Promise<void> {
		const id5Config = id5.getConfig();

		if (!id5Config) {
			return;
		}

		this.prebidConfig.userSync.userIds.push(id5Config);

		if (id5Config.params.abTesting.enabled) {
			pbjsFactory.init().then((pbjs: Pbjs) => id5.setupAbTesting(pbjs));
		}

		id5.enableAnalytics();
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

	private configureS2sBidding(): object {
		if (!context.get('bidders.s2s.enabled')) {
			return;
		}

		const s2sBidders = context.get('bidders.s2s.bidders') || [];
		utils.logger(logGroup, 'Prebid s2s enabled', s2sBidders);

		const extPrebidBidders = this.prepareExtPrebidBiders(s2sBidders);

		return {
			cache: {
				url: 'https://prebid-server.rubiconproject.com/cache',
				ignoreBidderCacheKey: true,
			},
			s2sConfig: [
				{
					accountId: s2sRubiconAccountId,
					bidders: s2sBidders,
					defaultVendor: 'rubicon',
					coopSync: true,
					userSyncLimit: 8,
					allowUnknownBidderCodes: true,
					extPrebid: {
						aliases: {
							mgnipbs: 'rubicon',
						},
						cache: {
							vastxml: { returnCreative: false },
						},
						extPrebidBidders,
					},
				},
			],
		};
	}

	private prepareExtPrebidBiders(s2sBidders: string[]): Record<string, { wrappername: string }> {
		const extPrebidBidders: Record<string, { wrappername: string }> = {};

		s2sBidders.forEach((name) => {
			extPrebidBidders[name] = {
				wrappername: `${s2sRubiconAccountId}_Web_Server`,
			};
		});

		return extPrebidBidders;
	}

	async configureAdUnits(adUnits: PrebidAdUnit[] = []): Promise<void> {
		await pbjsFactory.init();

		if (adUnits.length) {
			this.adUnits = adUnits;
		} else if (!this.adUnits) {
			this.adUnits = adaptersRegistry.setupAdUnits();
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
			this.adUnits = adaptersRegistry.setupAdUnits();
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
		const allTargetingKeys: string[] = Object.keys(targetingService.dump(slotName) || {});

		return allTargetingKeys.filter((key) => key.indexOf('hb_') === 0);
	}

	async getTargetingParams(slotName: string): Promise<PrebidTargeting> {
		const pbjs: Pbjs = await pbjsFactory.init();
		const slotAlias: string = this.getSlotAlias(slotName);
		const targeting = pbjs.getAdserverTargeting();

		return targeting[slotAlias];
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

	/**
	 * @inheritDoc
	 */
	calculatePrices(): void {
		return;
	}
}
