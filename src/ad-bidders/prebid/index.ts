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
import { Ats } from './ats';
import { id5 } from './id5';
import { intentIQ } from './intent-iq';
import { liveRamp } from './live-ramp';
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
		};

		this.configureUserSync();

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
		this.configureLiveRamp();
		this.configureId5();
	}

	private configureLiveRamp(): void {
		const liveRampConfig = liveRamp.getConfig();
		if (liveRampConfig !== undefined) {
			this.prebidConfig.userSync.userIds.push(liveRampConfig);
			this.prebidConfig.userSync.syncDelay = 3000;
		}
	}

	private async configureId5(): Promise<void> {
		const id5Config = id5.getConfig();

		if (id5Config !== undefined) {
			this.prebidConfig.userSync.userIds.push(id5Config);
			this.prebidConfig.userSync.auctionDelay = 50;
		}

		if (id5Config.params.abTesting.enabled) {
			const pbjs: Pbjs = await pbjsFactory.init();
			await id5.setupAbTesting(pbjs);
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
		pbjs.onEvent(
			'adRenderSucceeded',
			(response: { adId: string; bid: PrebidBidResponse; doc: Document | null }) =>
				intentIQ.reportPrebidWin(response.bid),
		);
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

		await intentIQ.initialize(pbjs);

		pbjs.requestBids({
			adUnits,
			bidsBackHandler,
			timeout,
		});
	}

	private enableATSAnalytics(): void {
		if (context.get('bidders.liveRampATSAnalytics.enabled')) {
			utils.logger(logGroup, 'prebid enabling ATS Analytics');

			(window as any).pbjs.que.push(() => {
				(window as any).pbjs.enableAnalytics([
					{
						provider: 'atsAnalytics',
						options: {
							pid: Ats.PLACEMENT_ID,
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
