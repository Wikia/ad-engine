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
import { BidderProvider, BidsRefreshing } from '../bidder-provider';
import { Apstag, Cmp, cmp } from '../wrappers';
import {
	A9Bid,
	A9Bids,
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

	private loaded = false;

	apstag: Apstag = Apstag.make();
	bids: A9Bids = {};
	cmp: Cmp = cmp;
	isRenderImpOverwritten = false;
	priceMap: PriceMap = {};
	// map of slot id to slot alias
	slotNamesMap: Dictionary<string> = {};
	targetingKeys: string[] = [];

	amazonId: string;
	bidsRefreshing: Partial<BidsRefreshing>;
	isCMPEnabled: boolean;
	slots: Dictionary<A9SlotConfig>;
	slotsNames: string[];

	constructor(public bidderConfig: A9Config, public timeout: number = DEFAULT_MAX_DELAY) {
		super('a9', bidderConfig, timeout);

		this.isCMPEnabled = context.get('custom.isCMPEnabled');
		this.amazonId = this.bidderConfig.amazonId;
		this.slots = this.bidderConfig.slots;
		this.slotsNames = Object.keys(this.slots);
		this.bidsRefreshing = context.get('bidders.a9.bidsRefreshing') || {};
	}

	getTargetingKeys(): string[] {
		return this.targetingKeys;
	}

	init(consentData: ConsentData = {}): void {
		this.initIfNotLoaded(consentData);

		this.bids = {};
		this.priceMap = {};
		const a9Slots = this.getA9SlotsDefinitions(this.slotsNames);

		this.fetchBids(a9Slots);
	}

	private initIfNotLoaded(consentData: ConsentData): void {
		if (!this.loaded) {
			this.apstag.init(this.getApstagConfig(consentData));
			this.loaded = true;
		}
	}

	private getApstagConfig(consentData: ConsentData): ApstagConfig {
		return {
			pubID: this.amazonId,
			videoAdServer: 'DFP',
			deals: !!this.bidderConfig.dealsEnabled,
			...this.getGdprIfApplicable(consentData),
		};
	}

	private getGdprIfApplicable(consentData: ConsentData): Partial<A9GDPR> {
		if (this.isCMPEnabled && consentData && consentData.consentData) {
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

		const currentBids: A9Bid[] = await this.apstag.fetchBids({ slots, timeout: this.timeout });

		utils.logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);
		this.addApstagRenderImpHookOnFirstFetch();

		await Promise.all(
			currentBids.map(async (bid) => {
				const slotName: string = this.slotNamesMap[bid.slotID] || bid.slotID;
				const { keys, bidTargeting } = await this.getBidTargetingWithKeys(bid);

				this.updateBidSlot(slotName, keys, bidTargeting);
			}),
		);

		this.onBidResponse();

		if (refresh) {
			eventService.emit(events.BIDS_REFRESH);
		}
	}

	private addApstagRenderImpHookOnFirstFetch(): void {
		if (!this.isRenderImpOverwritten) {
			this.isRenderImpOverwritten = true;
			this.addApstagRenderImpHook();
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
	createSlotDefinition(slotAlias: string): A9SlotDefinition | null {
		const config: A9SlotConfig = this.slots[slotAlias];
		const slotID: string = config.slotId || slotAlias;
		const definition: A9SlotDefinition = {
			slotID,
			slotName: slotID,
		};

		this.slotNamesMap[slotID] = slotAlias;

		if (!this.bidderConfig.videoEnabled && config.type === 'video') {
			return null;
		}
		if (config.type === 'video') {
			definition.mediaType = 'video';
		} else {
			definition.sizes = config.sizes;
		}

		return definition;
	}

	private async getBidTargetingWithKeys(
		bid: A9Bid,
	): Promise<{ keys: string[]; bidTargeting: Dictionary }> {
		let bidTargeting: Dictionary = bid;
		let keys: string[] = await this.apstag.targetingKeys();

		if (this.bidderConfig.dealsEnabled) {
			keys = await bid.helpers.targetingKeys;
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
		if (this.isCMPEnabled && this.cmp.exists) {
			const consentData = await this.cmp.getConsentData();

			this.init(consentData);
		} else {
			this.init();
		}
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
