import { context, events, eventService, utils } from '@wikia/ad-engine';
import { decorate } from 'core-decorators';
import { BaseBidder } from '../base-bidder';
import { getPriorities } from './adapters-registry';
import { getAvailableBidsByAdUnitCode, setupAdUnits } from './prebid-helper';
import { getSettings } from './prebid-settings';
import { getPrebidBestPrice } from './price-helper';

function postponeExecutionUntilPbjsLoads(method) {
	return function (...args) {
		return window.pbjs.que.push(() => method.apply(this, args));
	};
}

eventService.on(events.VIDEO_AD_IMPRESSION, markWinningBidAsUsed);
eventService.on(events.VIDEO_AD_ERROR, markWinningBidAsUsed);

function markWinningBidAsUsed(adSlot) {
	// Mark ad as rendered
	const adId = context.get(`slots.${adSlot.getSlotName()}.targeting.hb_adid`);

	if (adId) {
		if (window.pbjs && typeof window.pbjs.markWinningBidAsUsed === 'function') {
			window.pbjs.markWinningBidAsUsed({ adId });
			eventService.emit(events.VIDEO_AD_USED, adSlot);
		}
	}
}

const logGroup = 'prebid';

let loaded = false;

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

export class Prebid extends BaseBidder {
	static validResponseStatusCode = 1;
	static errorResponseStatusCode = 2;

	constructor(bidderConfig, timeout = 2000) {
		super('prebid', bidderConfig, timeout);

		this.insertScript();

		this.lazyLoaded = false;
		this.isLazyLoadingEnabled = this.bidderConfig.lazyLoadingEnabled;
		this.isCMPEnabled = context.get('custom.isCMPEnabled');
		this.adUnits = setupAdUnits(this.bidderConfig, this.isLazyLoadingEnabled ? 'pre' : 'off');
		this.prebidConfig = {
			debug:
				utils.queryString.get('pbjs_debug') === '1' ||
				utils.queryString.get('pbjs_debug') === 'true',
			enableSendAllBids: true,
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			cache: {
				url: 'https://prebid.adnxs.com/pbc/v1/cache',
			},
			userSync: {
				iframeEnabled: true,
				enabledBidders: [],
				syncDelay: 6000,
			},
		};
		this.bidsRefreshing = context.get('bidders.prebid.bidsRefreshing');

		if (this.isCMPEnabled) {
			this.prebidConfig.consentManagement = {
				cmpApi: 'iab',
				timeout: this.timeout,
				allowAuctionWithoutConsent: false,
			};
		}

		window.pbjs = window.pbjs || {};
		window.pbjs.que = window.pbjs.que || [];

		this.applyConfig(this.prebidConfig);

		if (this.bidsRefreshing && this.bidsRefreshing.enabled) {
			this.registerBidsRefreshing();
		}
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	applyConfig(config) {
		window.pbjs.setConfig(config);
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	applySettings() {
		window.pbjs.bidderSettings = getSettings();
	}

	/**
	 * @protected
	 */
	callBids(bidsBackHandler) {
		if (!this.adUnits) {
			this.adUnits = setupAdUnits(this.bidderConfig, this.isLazyLoadingEnabled ? 'pre' : 'off');
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

	/**
	 * @private
	 */
	insertScript() {
		if (loaded) {
			return;
		}

		const libraryUrl = context.get('bidders.prebid.libraryUrl');

		if (!libraryUrl) {
			utils.logger(
				logGroup,
				'Prebid library URL not defined. Assuming that window.pbjs will be loaded.',
			);

			return;
		}

		utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
		loaded = true;
	}

	lazyCall(bidsBackHandler) {
		if (this.lazyLoaded) {
			return;
		}

		this.lazyLoaded = true;

		const adUnitsLazy = setupAdUnits(this.bidderConfig, 'post');

		if (adUnitsLazy.length > 0) {
			this.requestBids(adUnitsLazy, bidsBackHandler);

			this.adUnits = this.adUnits.concat(adUnitsLazy);
		}
	}

	removeAdUnits() {
		(window.pbjs.adUnits || []).forEach((adUnit) => {
			window.pbjs.removeAdUnit(adUnit.code);
		});
	}

	/**
	 * @inheritDoc
	 */
	getBestPrice(slotName) {
		const slotAlias = this.getSlotAlias(slotName);

		return getPrebidBestPrice(slotAlias);
	}

	getTargetingKeysToReset() {
		return ['hb_bidder', 'hb_adid', 'hb_pb', 'hb_size', 'hb_uuid'];
	}

	/**
	 * @inheritDoc
	 */
	getTargetingParams(slotName) {
		let slotParams = {};

		const slotAlias = this.getSlotAlias(slotName);
		const bids = getAvailableBidsByAdUnitCode(slotAlias);

		if (bids.length) {
			let bidParams = null;
			const priorities = getPriorities();

			bids.forEach((param) => {
				if (!bidParams) {
					bidParams = param;
				} else if (bidParams.cpm === param.cpm) {
					if (priorities[bidParams.bidder] === priorities[param.bidder]) {
						bidParams = bidParams.timeToRespond > param.timeToRespond ? param : bidParams;
					} else {
						bidParams = priorities[bidParams.bidder] < priorities[param.bidder] ? param : bidParams;
					}
				} else {
					bidParams = bidParams.cpm < param.cpm ? param : bidParams;
				}
			});

			if (bidParams) {
				slotParams = bidParams.adserverTargeting;
			}

			// ADEN-7436: AppNexus hb_uuid fix
			// (adserverTargeting params are being set before cache key is returned)
			slotParams.hb_uuid = slotParams.hb_uuid || bidParams.videoCacheKey || 'disabled';
		}

		return slotParams || {};
	}

	/**
	 * @inheritDoc
	 */
	isSupported(slotName) {
		const slotAlias = this.getSlotAlias(slotName);

		return this.adUnits && this.adUnits.some((adUnit) => adUnit.code === slotAlias);
	}

	registerBidsRefreshing() {
		window.pbjs.que.push(() => {
			const refreshUsedBid = (winningBid) => {
				if (this.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
					eventService.emit(events.BIDS_REFRESH);
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

			window.pbjs.onEvent('bidWon', refreshUsedBid);
			eventService.once(events.PAGE_CHANGE_EVENT, () => {
				window.pbjs.offEvent('bidWon', refreshUsedBid);
			});
		});
	}

	@decorate(postponeExecutionUntilPbjsLoads)
	requestBids(adUnits, bidsBackHandler, withRemove = undefined) {
		if (withRemove) {
			withRemove();
		}

		window.pbjs.requestBids({
			adUnits,
			bidsBackHandler,
		});
	}

	/**
	 * @inheritDoc
	 */
	calculatePrices() {
		return null;
	}
}
