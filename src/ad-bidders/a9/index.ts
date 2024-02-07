import {
	CcpaSignalPayload,
	communicationService,
	eventsRepository,
	GdprConsentPayload,
	TrackingBidDefinition,
} from '@ad-engine/communication';
import {
	AdSlot,
	AdSlotEvent,
	context,
	DEFAULT_MAX_DELAY,
	Dictionary,
	SlotConfig,
	slotService,
	targetingService,
	trackingOptIn,
	utils,
} from '@ad-engine/core';
import {
	defaultSlotBidGroup,
	getSlotAlias,
	getSlotAliasOrName,
	getSlotNameByBidderAlias,
	hasCorrectBidGroup,
} from '../bidder-helper';
import { BidderProvider, BidsRefreshing } from '../bidder-provider';
import { Apstag } from '../wrappers';
import { A9Bid, A9Bids, A9Config, A9SlotConfig, A9SlotDefinition, PriceMap } from './types';

const logGroup = 'A9Provider';

export class A9Provider extends BidderProvider {
	static A9_CLASS = 'a9-ad';
	static VIDEO_TTL = 10 * 60 * 1000; // 10 minutes for video bid to expire
	private static isApstagConfigured = false;

	private static mapResponseToTrackingBidDefinition(
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
			slotName: getSlotNameByBidderAlias(slotName, true),
		};
	}

	public static isEnabled(): boolean {
		const enabled = context.get('bidders.a9.enabled');
		return enabled && !utils.isCoppaSubject();
	}

	public static initApstag() {
		Apstag.make();
	}

	private loaded = false;

	apstag: Apstag = Apstag.make();
	bids: A9Bids = {};
	priceMap: PriceMap = {};
	targetingKeys: string[] = [];

	amazonId: string;
	bidsRefreshing: Partial<BidsRefreshing>;
	slots: Dictionary<A9SlotConfig>;
	slotsNames: string[];

	constructor(
		public bidderConfig: A9Config,
		public timeout: number = DEFAULT_MAX_DELAY,
		private bidGroup: string = defaultSlotBidGroup,
	) {
		super('a9', bidderConfig, timeout);

		this.amazonId = this.bidderConfig.amazonId;
		this.slots = this.bidderConfig.slots;
		this.slotsNames = Object.keys(this.slots);
		this.bidsRefreshing = context.get('bidders.a9.bidsRefreshing') || {};
	}

	getTargetingKeys(): string[] {
		return this.targetingKeys;
	}

	private async initIfNotLoaded(): Promise<void> {
		if (!this.loaded) {
			if (context.get('custom.hasFeaturedVideo')) {
				communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, ({ slot }) =>
					this.removeBids(slot),
				);
				communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_ERROR, ({ slot }) =>
					this.removeBids(slot),
				);
				communicationService.on(
					eventsRepository.AD_ENGINE_INVALIDATE_SLOT_TARGETING,
					({ slot }) => this.invalidateSlotTargeting(slot),
					false,
				);
			}

			await this.apstag.init();

			communicationService.onMany(
				[eventsRepository.AD_ENGINE_CONSENT_UPDATE, eventsRepository.AD_ENGINE_CONSENT_READY],
				(consents: GdprConsentPayload & CcpaSignalPayload) => {
					const record = this.apstag.getRecord();
					if (record) {
						this.apstag.sendHEM(record, consents);
					}
				},
				false,
			);

			if (!trackingOptIn.isOptedIn() || trackingOptIn.isOptOutSale()) {
				utils.logger(logGroup, 'A9 was initialized without consents');
				communicationService.emit(eventsRepository.A9_WITHOUT_CONSENTS);
			}

			this.loaded = true;
		}
	}

	private removeBids(adSlot: AdSlot): void {
		const slotAlias = getSlotAliasOrName(adSlot.getSlotName(), true);

		delete this.bids[slotAlias];

		if (adSlot.isVideo()) {
			adSlot.emit(AdSlotEvent.VIDEO_AD_USED);
		}
	}

	private invalidateSlotTargeting(adSlot: AdSlot): void {
		const expirationDate = Date.parse(
			targetingService.get('amznExpirationDate', adSlot.getSlotName()),
		);
		const currentDate = new Date().getTime();

		if (expirationDate < currentDate) {
			const slotAlias = getSlotAliasOrName(adSlot.getSlotName(), true);
			delete this.bids[slotAlias];
			this.targetingKeys.forEach((key: string) => {
				targetingService.remove(key, adSlot.getSlotName());
			});
		}
	}

	/**
	 * Transforms slots names into A9 slot definitions.
	 */
	getA9SlotsDefinitions(slotsNames: string[]): A9SlotDefinition[] {
		return slotsNames
			.filter((slotName: string) => hasCorrectBidGroup(slotName, this.bidGroup, true))
			.map((slotName: string) => getSlotAliasOrName(slotName, true))
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
		const expirationDate = new Date(endTime + A9Provider.VIDEO_TTL);

		utils.logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);
		this.configureApstagOnce();

		await Promise.all(
			currentBids.map(async (bid) => {
				const slotName: string = bid.slotID;
				const { keys, bidTargeting } = await this.getBidTargetingWithKeys(bid);

				this.updateBidSlot(slotName, keys, bidTargeting, expirationDate);

				communicationService.emit(eventsRepository.BIDDERS_BIDS_RESPONSE, {
					bidResponse: A9Provider.mapResponseToTrackingBidDefinition(
						bid.slotID,
						bidTargeting,
						endTime,
						endTime - startTime,
					),
				});
			}),
		);

		this.onBidResponse();

		if (refresh) {
			const refreshedSlotNames = slots.map((slot) => slot.slotName);

			communicationService.emit(eventsRepository.BIDDERS_BIDS_REFRESH, {
				refreshedSlotNames,
			});
		}
	}

	private configureApstagOnce(): void {
		if (A9Provider.isApstagConfigured) {
			return;
		}

		A9Provider.isApstagConfigured = true;
		this.addApstagRenderImpHook();
		this.registerVideoBidsRefreshing();
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
			delete this.bids[getSlotAliasOrName(slotName, true)];

			this.refreshBid(slot);

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
			getSlotAliasOrName(slot.getSlotName(), true),
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
		return this.bidsRefreshing.slots.includes(getSlotAliasOrName(slot.getSlotName(), true));
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
		communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, ({ slot }) =>
			this.refreshVideoBids(slot),
		);
		communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_ERROR, ({ slot }) =>
			this.refreshVideoBids(slot),
		);
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
		await this.apstag.targetingKeys();

		return {
			keys: bid.helpers.targetingKeys,
			bidTargeting: bid.targeting,
		};
	}

	private updateBidSlot(
		slotName: string,
		keys: string[],
		bidTargeting: Dictionary,
		expirationDate: Date,
	): void {
		this.bids[slotName] = {};
		keys.forEach((key) => {
			if (this.targetingKeys.indexOf(key) === -1) {
				this.targetingKeys.push(key);
			}
			this.bids[slotName][key] = bidTargeting[key];
		});

		if (context.get(`slots.${slotName}.isVideo`)) {
			this.bids[slotName]['amznExpirationDate'] = expirationDate.toString();
			this.targetingKeys.push('amznExpirationDate');
		}
	}

	protected callBids(): void {
		this.bids = {};
		this.priceMap = {};
		const a9Slots = this.getA9SlotsDefinitions(this.slotsNames);

		this.initIfNotLoaded().then(() => this.fetchBids(a9Slots));
	}

	calculatePrices(): void {
		Object.keys(this.bids).forEach((slotName) => {
			this.priceMap[slotName] = this.bids[slotName].amznbid;
		});
	}

	async getBestPrice(slotName: string): Promise<{ a9?: string }> {
		const slotAlias: string = getSlotAliasOrName(slotName, true);

		return this.priceMap[slotAlias] ? { a9: this.priceMap[slotAlias] } : {};
	}

	async getTargetingParams(slotName: string): Promise<Dictionary> {
		return this.bids[getSlotAliasOrName(slotName, true)] || {};
	}

	isSupported(slotName: string): boolean {
		return !!this.slots[getSlotAliasOrName(slotName, true)];
	}

	/**
	 * Checks whether given A9 slot definition is used by alias
	 */
	private isSlotEnabled(slotID: string): boolean {
		const someEnabledByAlias: boolean = Object.keys(context.get('slots')).some(
			(slotName) => getSlotAlias(slotName, true) === slotID && slotService.getState(slotName),
		);

		const slotConfig: SlotConfig = context.get(`slots.${slotID}`);

		return slotConfig && Object.keys(slotConfig).length > 0
			? slotService.getState(slotID)
			: someEnabledByAlias;
	}
}
