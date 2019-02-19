import { context, events, slotService, utils } from '@wikia/ad-engine';
import { BaseBidder } from '../base-bidder';

/**
 * @typedef {Object} A9SlotDefinition
 * @property {string} slotID
 * @property {string} slotName
 */

let loaded = false;
const logGroup = 'A9';

export class A9 extends BaseBidder {
	constructor(bidderConfig, timeout = 2000) {
		super('a9', bidderConfig, timeout);

		this.isCMPEnabled = context.get('custom.isCMPEnabled');
		this.amazonId = this.bidderConfig.amazonId;
		this.slots = this.bidderConfig.slots;
		this.slotsNames = Object.keys(this.slots);
		this.bids = {};
		this.priceMap = {};
		this.slotNamesMap = {};
		this.targetingKeys = [];
		this.timeout = timeout;
		this.bidsRefreshing = context.get('bidders.a9.bidsRefreshing');
		this.isBidsRefreshingEnabled = this.bidsRefreshing && this.bidsRefreshing.enabled;
		this.isRenderImpOverwritten = false;
	}

	calculatePrices() {
		Object.keys(this.bids).forEach((slotName) => {
			this.priceMap[slotName] = this.bids[slotName].amznbid;
		});
	}

	callBids() {
		if (window.__cmp) {
			window.__cmp('getConsentData', null, (consentData) => {
				this.init(consentData);
			});
		} else {
			this.init();
		}
	}

	init(consentData = {}) {
		if (!loaded) {
			this.insertScript();
			this.configureApstag();

			const apsConfig = {
				pubID: this.amazonId,
				videoAdServer: 'DFP',
				deals: !!this.bidderConfig.dealsEnabled,
			};

			if (this.isCMPEnabled && consentData && consentData.consentData) {
				apsConfig.gdpr = {
					enabled: consentData.gdprApplies,
					consent: consentData.consentData,
					cmpTimeout: 5000,
				};
			}

			window.apstag.init(apsConfig);

			loaded = true;
		}

		this.bids = {};
		this.priceMap = {};

		const a9Slots = this.getA9SlotsDefinitions(this.slotsNames);

		this.fetchBids(a9Slots);
	}

	/**
	 * Fetches bids from A9.
	 *
	 * Calls this.onResponse() upon success.
	 *
	 * @param {A9SlotDefinition[]} slots
	 */
	fetchBids(slots, refresh = false) {
		utils.logger(logGroup, 'fetching bids for slots', slots);
		window.apstag.fetchBids(
			{
				slots,
				timeout: this.timeout,
			},
			(currentBids) => {
				utils.logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);
				// overwrite window.apstag.renderImp on the first fetch
				if (!this.isRenderImpOverwritten) {
					this.overwriteRenderImp();
					this.isRenderImpOverwritten = true;
				}
				currentBids.forEach((bid) => {
					const slotName = this.slotNamesMap[bid.slotID] || bid.slotID;

					let bidTargeting = bid;
					let keys = window.apstag.targetingKeys();

					if (this.bidderConfig.dealsEnabled) {
						keys = bid.helpers.targetingKeys;
						bidTargeting = bid.targeting;
					}

					this.bids[slotName] = {};
					keys.forEach((key) => {
						if (this.targetingKeys.indexOf(key) === -1) {
							this.targetingKeys.push(key);
						}
						this.bids[slotName][key] = bidTargeting[key];
					});
				});

				this.onResponse();
				if (refresh) {
					events.emit(events.BIDS_REFRESH);
				}
			},
		);
	}

	configureApstag() {
		window.apstag = window.apstag || {};
		window.apstag._Q = window.apstag._Q || [];

		if (typeof window.apstag.init === 'undefined') {
			window.apstag.init = (...args) => {
				this.configureApstagCommand('i', args);
			};
		}

		if (typeof window.apstag.fetchBids === 'undefined') {
			window.apstag.fetchBids = (...args) => {
				this.configureApstagCommand('f', args);
			};
		}
	}

	configureApstagCommand(command, args) {
		window.apstag._Q.push([command, args]);
	}

	getBestPrice(slotName) {
		const slotAlias = this.getSlotAlias(slotName);

		return this.priceMap[slotAlias] ? { a9: this.priceMap[slotAlias] } : {};
	}

	getPrices() {
		return this.priceMap;
	}

	getTargetingKeysToReset() {
		return this.targetingKeys;
	}

	getTargetingParams(slotName) {
		return this.bids[this.getSlotAlias(slotName)] || {};
	}

	insertScript() {
		utils.scriptLoader.loadScript(
			'//c.amazon-adsystem.com/aax2/apstag.js',
			'text/javascript',
			true,
			'first',
		);
	}

	/**
	 * Wraps apstag.renderImp
	 *
	 * Calls this.refreshBid() if bids refreshing is enabled.
	 */
	overwriteRenderImp() {
		utils.logger(logGroup, 'overwriting window.apstag.renderImp');
		window.apstag.renderImp = ((original) => (doc, impId) => {
			original(doc, impId);

			const slot = this.getRenderedSlot(impId);
			const slotName = slot.getSlotName();

			utils.logger(logGroup, `bid used for slot ${slotName}`);
			delete this.bids[this.getSlotAlias(slotName)];

			if (window.apstag.renderImp && this.isBidsRefreshingEnabled) {
				this.refreshBid(slot);
			}
		})(window.apstag.renderImp);
	}

	/**
	 * Checks if slot with given name is supported by bidder.
	 *
	 * @param {string} slotName
	 * @returns {boolean}
	 */
	isSupported(slotName) {
		return !!this.slots[this.getSlotAlias(slotName)];
	}

	/**
	 * Checks if slot should be refreshed.
	 *
	 * @param {AdSlot} slot
	 * @returns {boolean}
	 */
	shouldRefreshSlot(slot) {
		return this.bidsRefreshing.slots.includes(this.getSlotAlias(slot.getSlotName()));
	}

	/**
	 * Returns slot which used bid with given impression id.
	 *
	 * @param {string | number} impId
	 * @returns {AdSlot | undefined }
	 */
	getRenderedSlot(impId) {
		let renderedSlot;

		slotService.forEach((slot) => {
			if (slot.getTargeting().amzniid === impId) {
				renderedSlot = slot;
			}
		});

		return renderedSlot;
	}

	/**
	 * Refreshes bid for given slot.
	 *
	 * @param {string | number} impId
	 */
	refreshBid(slot) {
		if (!this.shouldRefreshSlot(slot)) {
			return;
		}

		const slotDef = this.createSlotDefinition(this.getSlotAlias(slot.getSlotName()));

		if (slotDef) {
			utils.logger(logGroup, 'refresh bids for slot', slotDef);
			this.fetchBids([slotDef], true);
		}
	}

	/**
	 * Transforms slots names into A9 slot definitions.
	 *
	 * @param {string[]} slotsNames
	 * @returns {A9SlotDefinition[]}
	 */
	getA9SlotsDefinitions(slotsNames) {
		return slotsNames
			.map((slotName) => this.getSlotAlias(slotName))
			.map((slotAlias) => this.createSlotDefinition(slotAlias))
			.filter((slot) => slot !== null);
	}

	/**
	 * Creates A9 slot definition from slot name.
	 *
	 * @param {string} slotName
	 * @returns {A9SlotDefinition | null} Returns null i
	 */
	createSlotDefinition(slotName) {
		const config = this.slots[slotName];
		const slotID = config.slotId || slotName;
		const definition = {
			slotID,
			slotName: slotID,
		};

		if (!slotService.getState(slotID)) {
			return null;
		}

		this.slotNamesMap[slotID] = slotName;

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
}
