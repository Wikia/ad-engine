import {
	AdSlot,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	events,
	eventService,
	SlotConfig,
	slotService,
	utils,
} from '@ad-engine/core';
import { TrackingBidDefinition } from '@ad-engine/tracking';
import { getSlotNameByBidderAlias } from '../alias-helper';
import { BidderProvider, BidsRefreshing } from '../bidder-provider';
import { Apstag, Cmp, cmp, Usp, usp } from '../wrappers';
import {
	A9Bid,
	A9Bids,
	A9CCPA,
	A9Config,
	A9GDPR,
	A9SlotConfig,
	A9SlotDefinition,
	ApstagConfig,
	PriceMap,
} from './types';

const logGroup = 'A9Provider';

export class A9Provider extends BidderProvider {
	static A9_CLASS = 'a9-ad';
	private static isApstagConfigured = false;

	private loaded = false;

	apstag: Apstag = Apstag.make();
	bids: A9Bids = {};
	cmp: Cmp = cmp;
	usp: Usp = usp;
	priceMap: PriceMap = {};
	targetingKeys: string[] = [];

	amazonId: string;
	bidsRefreshing: Partial<BidsRefreshing>;
	slots: Dictionary<A9SlotConfig>;
	slotsNames: string[];

	constructor(public bidderConfig: A9Config, public timeout: number = DEFAULT_MAX_DELAY) {
		super('a9', bidderConfig, timeout);

		this.amazonId = this.bidderConfig.amazonId;
		this.slots = this.bidderConfig.slots;
		this.slotsNames = Object.keys(this.slots);
		this.bidsRefreshing = context.get('bidders.a9.bidsRefreshing') || {};
	}

	getTargetingKeys(): string[] {
		return this.targetingKeys;
	}

	init(consentData: ConsentData = {}, signalData: SignalData = {}): void {
		this.initIfNotLoaded(consentData, signalData);

		this.bids = {};
		this.priceMap = {};
		const a9Slots = this.getA9SlotsDefinitions(this.slotsNames);

		this.fetchBids(a9Slots);
	}

	private initIfNotLoaded(consentData: ConsentData, signalData: SignalData): void {
		if (!this.loaded) {
			if (context.get('bidders.a9.videoBidsCleaning')) {
				eventService.on(events.VIDEO_AD_IMPRESSION, (adSlot: AdSlot) => this.removeBids(adSlot));
				eventService.on(events.VIDEO_AD_ERROR, (adSlot: AdSlot) => this.removeBids(adSlot));
			}

			this.apstag.init(this.getApstagConfig(consentData, signalData));
			this.loaded = true;
		}
	}

	private removeBids(adSlot: AdSlot) {
		const slotAlias = this.getSlotAlias(adSlot.getSlotName());

		delete this.bids[slotAlias];

		if (adSlot.isVideo()) {
			eventService.emit(events.VIDEO_AD_USED, adSlot);
		}
	}

	private getApstagConfig(consentData: ConsentData, signalData: SignalData): ApstagConfig {
		return {
			pubID: this.amazonId,
			videoAdServer: 'DFP',
			deals: !!this.bidderConfig.dealsEnabled,
			...this.getGdprIfApplicable(consentData),
			...this.getCcpaIfApplicable(signalData),
		};
	}

	private getGdprIfApplicable(consentData: ConsentData): Partial<A9GDPR> {
		if (consentData && consentData.consentData) {
			return {
				gdpr: {
					enabled: consentData.gdprApplies,
					consent: consentData.consentData,
					cmpTimeout: 5000,
				},
			};
		}

		return {};
	}

	private getCcpaIfApplicable(signalData: SignalData): Partial<A9CCPA> {
		if (signalData && signalData.uspString) {
			return {
				params: {
					us_privacy: signalData.uspString,
				},
			};
		}

		return {};
	}

	/**
	 * Transforms slots names into A9 slot definitions.
	 */
	getA9SlotsDefinitions(slotsNames: string[]): A9SlotDefinition[] {
		return slotsNames
			.map((slotName: string) => this.getSlotAlias(slotName))
			.filter((slotAlias: string) => this.isSlotEnabled(slotAlias))
			.map((slotAlias: string) => this.createSlotDefinition(slotAlias))
			.filter((slot) => slot !== null);
	}

	/**
	 * Fetches bids from A9.
	 * Calls this.onBidResponse() upon success.
	 */
	private async fetchBids(slots: A9SlotDefinition[], refresh = false): Promise<void> {
		utils.logger(logGroup, 'fetching bids for slots', slots);

		if (!slots || slots.length === 0) {
			utils.logger(logGroup, 'there is no slots to fetch bids');
			return;
		}

		const startTime = new Date().getTime();
		const currentBids: A9Bid[] = await this.apstag.fetchBids({ slots, timeout: this.timeout });
		const endTime: number = new Date().getTime();

		utils.logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);
		this.configureApstagOnce();

		await Promise.all(
			currentBids.map(async (bid) => {
				const slotName: string = bid.slotID;
				const { keys, bidTargeting } = await this.getBidTargetingWithKeys(bid);

				this.updateBidSlot(slotName, keys, bidTargeting);

				eventService.emit(
					events.BIDS_RESPONSE,
					this.mapResponseToTrackingBidDefinition(
						bid.slotID,
						bidTargeting,
						endTime,
						endTime - startTime,
					),
				);
			}),
		);

		this.onBidResponse();

		if (refresh) {
			const refreshedSlotNames = slots.map((slot) => slot.slotName);

			eventService.emit(events.BIDS_REFRESH, refreshedSlotNames);
		}
	}

	private mapResponseToTrackingBidDefinition(
		slotName: string,
		bid: Dictionary,
		responseTimestamp: number,
		timeToRespond: number,
	): TrackingBidDefinition {
		return {
			responseTimestamp,
			timeToRespond,
			bidderName: 'a9',
			buyerId: bid.amznp,
			price: bid.amznbid,
			size: bid.amznsz,
			slotName: getSlotNameByBidderAlias(slotName),
		};
	}

	private configureApstagOnce(): void {
		if (A9Provider.isApstagConfigured) {
			return;
		}

		A9Provider.isApstagConfigured = true;
		this.addApstagRenderImpHook();

		if (this.bidsRefreshing.enabled) {
			this.registerVideoBidsRefreshing();
		}
	}

	/**
	 * Wraps apstag.renderImp
	 * Calls this.refreshBid() if bids refreshing is enabled.
	 */
	private addApstagRenderImpHook(): void {
		utils.logger(logGroup, 'overwriting window.apstag.renderImp');
		this.apstag.onRenderImpEnd((doc: HTMLDocument, impId: string) => {
			if (!impId) {
				utils.logger(logGroup, 'apstag.renderImp() called with 1 argument only');
				return;
			}

			const slot: AdSlot = this.getRenderedSlot(impId);
			const slotName: string = slot.getSlotName();

			slot.addClass(A9Provider.A9_CLASS);
			utils.logger(logGroup, `bid used for slot ${slotName}`);
			delete this.bids[this.getSlotAlias(slotName)];

			if (this.bidsRefreshing.enabled) {
				this.refreshBid(slot);
			}

			slot.updateWinningA9BidderDetails();
		});
	}

	/**
	 * Returns slot which used bid with given impression id.
	 */
	private getRenderedSlot(impId: string | number): AdSlot | undefined {
		return Object.values(slotService.slots).filter(
			(slot: AdSlot) => slot.getTargeting().amzniid === impId,
		)[0];
	}

	/**
	 * Refreshes bid for given slot.
	 */
	private refreshBid(slot: AdSlot): void {
		if (!this.shouldRefreshSlot(slot)) {
			return;
		}

		const slotDef: A9SlotDefinition = this.createSlotDefinition(
			this.getSlotAlias(slot.getSlotName()),
		);

		if (slotDef) {
			utils.logger(logGroup, 'refresh bids for slot', slotDef);
			this.fetchBids([slotDef], true);
		}
	}

	/**
	 * Checks if slot should be refreshed.
	 */
	private shouldRefreshSlot(slot: AdSlot): boolean {
		return this.bidsRefreshing.slots.includes(this.getSlotAlias(slot.getSlotName()));
	}

	/**
	 * Creates A9 slot definition from slot alias.
	 */
	createSlotDefinition(slotName: string): A9SlotDefinition | null {
		const config: A9SlotConfig = this.slots[slotName];
		const definition: A9SlotDefinition = {
			slotName,
			slotID: slotName,
		};

		if (!config || (!this.bidderConfig.videoEnabled && config.type === 'video')) {
			return null;
		}
		if (config.type === 'video') {
			definition.mediaType = 'video';
		} else {
			definition.sizes = config.sizes;
		}

		return definition;
	}

	private registerVideoBidsRefreshing(): void {
		eventService.on(events.VIDEO_AD_IMPRESSION, (adSlot) => this.refreshVideoBids(adSlot));
		eventService.on(events.VIDEO_AD_ERROR, (adSlot) => this.refreshVideoBids(adSlot));
	}

	private refreshVideoBids(adSlot: AdSlot): void {
		if (!this.shouldRefreshSlot(adSlot)) {
			return;
		}

		this.removeBids(adSlot);
		this.refreshBid(adSlot);
	}

	private async getBidTargetingWithKeys(
		bid: A9Bid,
	): Promise<{ keys: string[]; bidTargeting: Dictionary }> {
		let bidTargeting: Dictionary = bid;
		let keys: string[] = await this.apstag.targetingKeys();

		if (this.bidderConfig.dealsEnabled) {
			keys = bid.helpers.targetingKeys;
			bidTargeting = bid.targeting;
		}

		return {
			keys,
			bidTargeting,
		};
	}

	private updateBidSlot(slotName: string, keys: string[], bidTargeting: Dictionary): void {
		this.bids[slotName] = {};
		keys.forEach((key) => {
			if (this.targetingKeys.indexOf(key) === -1) {
				this.targetingKeys.push(key);
			}
			this.bids[slotName][key] = bidTargeting[key];
		});
	}

	protected async callBids(): Promise<void> {
		let consentData = null;
		let signalData = null;

		if (this.cmp.exists) {
			consentData = await this.cmp.getConsentData();
		}

		if (this.usp.exists) {
			signalData = await this.usp.getSignalData();
		}

		this.init(consentData, signalData);
	}

	calculatePrices(): void {
		Object.keys(this.bids).forEach((slotName) => {
			this.priceMap[slotName] = this.bids[slotName].amznbid;
		});
	}

	async getBestPrice(slotName: string): Promise<{ a9?: string }> {
		const slotAlias: string = this.getSlotAlias(slotName);

		return this.priceMap[slotAlias] ? { a9: this.priceMap[slotAlias] } : {};
	}

	async getTargetingParams(slotName: string): Promise<Dictionary> {
		return this.bids[this.getSlotAlias(slotName)] || {};
	}

	isSupported(slotName: string): boolean {
		return !!this.slots[this.getSlotAlias(slotName)];
	}

	/**
	 * Checks whether given A9 slot definition is used by alias
	 */
	private isSlotEnabled(slotID: string): boolean {
		const someEnabledByAlias: boolean = Object.keys(context.get('slots')).some((slotName) => {
			const bidderAlias: string = context.get(`slots.${slotName}.bidderAlias`);

			return bidderAlias === slotID && slotService.getState(slotName);
		});

		const slotConfig: SlotConfig = context.get(`slots.${slotID}`);

		return slotConfig && Object.keys(slotConfig).length > 0
			? slotService.getState(slotID)
			: someEnabledByAlias;
	}
}
