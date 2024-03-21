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
import {
	defaultSlotBidGroup,
	getSlotAliasOrName,
	getSlotNameByBidderAlias,
} from '../bidder-helper';
import { BidderConfig, BidderProvider, BidsRefreshing } from '../bidder-provider';
import { adaptersRegistry } from './adapters-registry';
import { id5 } from './id5';
import { intentIQ } from './intent-iq';
import { connectedId } from './liveintent-connected-id';
import { liveRampId, LiveRampIdTypes } from './liveramp-id';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice, roundBucketCpm } from './price-helper';
import { prebidIdRetriever } from './utils/id-retriever';
import { yahooConnectId } from './yahoo-connect-id';

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

		utils.logger(logGroup, 'marking video bid as used', adSlot.getSlotName(), adId);
		pbjs.markWinningBidAsUsed({ adId });
		adSlot.emit(AdSlotEvent.VIDEO_AD_USED);
	}
}

export class PrebidProvider extends BidderProvider {
	adUnits: PrebidAdUnit[];
	bidsRefreshing: BidsRefreshing;
	prebidConfig: Dictionary;
	tcf: Tcf = tcf;

	constructor(
		public bidderConfig: PrebidConfig,
		public timeout = DEFAULT_MAX_DELAY,
		private bidGroup: string = defaultSlotBidGroup,
	) {
		super('prebid', bidderConfig, timeout);
		adaptersRegistry.configureAdapters();

		this.adUnits = adaptersRegistry.setupAdUnits(this.bidGroup);
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing') || {};

		this.prebidConfig = {
			enableTIDs: true,
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
			ozone: {
				enhancedAdserverTargeting: false,
				oz_whitelist_adserver_keys: [],
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
			...this.configureJwpRtd(),
			...this.configureDSA(),
			...context.get('bidders.prebid.config'),
		};

		this.configureUserSync();
		this.configureSChain();

		this.applyConfig(this.prebidConfig);
		this.configureAdUnits();
		this.registerBidsRefreshing();
		this.registerBidsTracking();
		this.enableATSAnalytics();

		utils.logger(logGroup, 'prebid created', this.prebidConfig);
	}

	private configureTargeting(): object {
		if (context.get('bidders.prebid.disableSendAllBids')) {
			return {
				enableSendAllBids: false,
				targetingControls: {
					alwaysIncludeDeals: true,
					allowTargetingKeys: [
						'AD_ID',
						'BIDDER',
						'DEAL',
						'PRICE_BUCKET',
						'SIZE',
						'UUID',
						'CACHE_HOST',
					],
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
				allowTargetingKeys: [
					'AD_ID',
					'BIDDER',
					'PRICE_BUCKET',
					'UUID',
					'SIZE',
					'DEAL',
					'CACHE_HOST',
				],
				allowSendAllBidsTargetingKeys: ['AD_ID', 'PRICE_BUCKET', 'UUID', 'SIZE', 'DEAL'],
			},
		};
	}

	private configureUserSync(): void {
		this.configureOzone();
		this.configureId5();
		this.configureLiveRamp();
		this.configureYahooConnectId();
		this.configureLiveIntentConnectedId();
	}

	private configureLiveIntentConnectedId(): void {
		const liveIntentConnectedIdConfig = connectedId.getConfig();
		if (liveIntentConnectedIdConfig) {
			this.prebidConfig.userSync.userIds.push(liveIntentConnectedIdConfig);
			targetingService.set('li-module-enabled', ['on']);
			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'liveintent_connectid_started',
			});
		} else {
			this.prebidConfig.userSync.userIds.push([]);
			targetingService.set('li-module-enabled', ['off']);
		}
	}

	private configureLiveRamp(): void {
		const liveRampConfig = liveRampId.getConfig();
		if (liveRampConfig !== undefined) {
			this.prebidConfig.userSync.userIds.push(liveRampConfig);
			this.prebidConfig.userSync.syncDelay = 3000;
		}
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

		const pbjs: Pbjs = await pbjsFactory.init();
		if (id5Config.params.abTesting.enabled) {
			id5.trackControlGroup(pbjs);
		}

		id5.enableAnalytics(pbjs);
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'id5_started',
		});
	}

	private configureYahooConnectId(): void {
		const yahooConnectIdConfig = yahooConnectId.getConfig();

		if (!yahooConnectIdConfig) {
			return;
		}

		communicationService.emit(eventsRepository.YAHOO_STARTED);

		this.prebidConfig.userSync.userIds.push(yahooConnectIdConfig);
	}

	private configureSChain(): void {
		this.configureWebAdsSChain();
	}

	private async configureWebAdsSChain(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		pbjs.setBidderConfig({
			bidders: ['relevantdigital'],
			config: {
				schain: {
					validation: 'strict',
					config: {
						ver: '1.0',
						complete: 1,
						nodes: [
							{
								asi: 'http://webads.eu',
								sid: '310035',
								hp: 1,
							},
						],
					},
				},
			},
		});
	}

	private enableATSAnalytics(): void {
		if (
			context.get('bidders.liveRampATSAnalytics.enabled') &&
			context.get('bidders.liveRampId.enabled')
		) {
			utils.logger(logGroup, 'prebid enabling ATS Analytics');

			(window as any).pbjs.que.push(() => {
				(window as any).pbjs.enableAnalytics([
					{
						provider: 'atsAnalytics',
						options: {
							pid: LiveRampIdTypes.PLACEMENT_ID,
						},
					},
				]);
			});
		}
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
						cache: {
							vastxml: { returnCreative: false },
						},
						bidders: extPrebidBidders,
					},
				},
			],
		};
	}

	private configureJwpRtd(): object {
		if (
			context.get('custom.hasFeaturedVideo') &&
			context.get('options.video.enableStrategyRules')
		) {
			const initialMediaId = context.get('options.video.jwplayer.initialMediaId');

			return {
				realTimeData: {
					auctionDelay: 100,
					dataProviders: [
						{
							name: 'jwplayer',
							waitForIt: true,
							params: {
								mediaIDs: initialMediaId ? [initialMediaId] : [],
							},
						},
					],
				},
			};
		}

		return {};
	}

	private configureDSA(): object {
		if (context.get('options.dsa.enabled')) {
			return {
				ortb2: {
					regs: {
						ext: {
							dsa: {
								dsarequired: 1,
								pubrender: 2,
								datatopub: 2,
							},
						},
					},
				},
			};
		}
		return {};
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
			this.adUnits = adaptersRegistry.setupAdUnits(this.bidGroup);
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
			this.adUnits = adaptersRegistry.setupAdUnits(this.bidGroup);
		}

		if (this.adUnits.length === 0) {
			return;
		}

		this.applySettings();
		this.removeAdUnits();
		this.saveBidIds();
		this.requestBids(this.adUnits, () => {
			bidsBackHandler();
			communicationService.emit(eventsRepository.BIDDERS_AUCTION_DONE);
		});

		communicationService.emit(eventsRepository.BIDDERS_BIDS_CALLED);
	}

	private saveBidIds(): void {
		utils.logger(this.logGroup, 'Saving bid ids');
		prebidIdRetriever.saveCurrentPrebidIds();
	}

	async removeAdUnits(): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		(pbjs.adUnits || []).forEach((adUnit) => pbjs.removeAdUnit(adUnit.code));
	}

	getBestPrice(slotName: string): Promise<Dictionary<string>> {
		return getPrebidBestPrice(getSlotAliasOrName(slotName));
	}

	getTargetingKeys(slotName: string): string[] {
		const allTargetingKeys: string[] = Object.keys(targetingService.dump(slotName) || {});

		return allTargetingKeys.filter((key) => key.indexOf('hb_') === 0);
	}

	async getTargetingParams(slotName: string): Promise<PrebidTargeting> {
		const pbjs: Pbjs = await pbjsFactory.init();
		let targeting: PrebidTargetingForAdUnits;

		try {
			targeting = pbjs.getAdserverTargeting();
		} catch {
			console.warn('Error while getting prebid targeting', slotName);
			targeting = {};
		}

		return targeting[getSlotAliasOrName(slotName)];
	}

	isSupported(slotName: string): boolean {
		const slotAlias: string = getSlotAliasOrName(slotName);

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
		pbjs.onEvent(
			'adRenderSucceeded',
			(response: { adId: string; bid: PrebidBidResponse; doc: Document | null }) =>
				intentIQ.reportPrebidWin(response.bid),
		);
	}

	private mapResponseToTrackingBidDefinition(response: PrebidBidResponse): TrackingBidDefinition {
		utils.logger(logGroup, 'Response: ', response);
		return {
			bidderName: response.bidderCode,
			price: response.cpm.toString(),
			responseTimestamp: response.responseTimestamp,
			slotName: getSlotNameByBidderAlias(response.adUnitCode),
			size: response.size,
			timeToRespond: response.timeToRespond,
			additionalInfo: response?.meta?.dsa ? { dsa: response.meta.dsa } : undefined,
		};
	}

	async requestBids(
		adUnits: PrebidAdUnit[],
		bidsBackHandler: (...args: any[]) => void,
		timeout: number = this.timeout,
	): Promise<void> {
		const pbjs: Pbjs = await pbjsFactory.init();

		await intentIQ.initialize(pbjs);

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
