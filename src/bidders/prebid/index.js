import { BaseBidder } from './../base-bidder';
import { queryString } from './../../utils/query-string';
import { getPriorities } from './adapters-registry';
import { getPrebidBestPrice} from './price-helper';
import { getSettings } from './prebid-settings';
import { setupAdUnits } from './prebid-helper';

export class Prebid extends BaseBidder {
	constructor(...args) {
		super(...args);

		this.logGroup = 'prebid-bidder';
		this.name = 'prebid';
		this.adUnits = setupAdUnits(this.bidderConfig);
		this.isCMPEnabled = false;
		this.prebidConfig = {
			debug: queryString.get('pbjs_debug') === '1',
			enableSendAllBids: true,
			bidderSequence: 'random',
			bidderTimeout: this.timeout,
			userSync: {
				iframeEnabled: true,
				enabledBidders: [],
				syncDelay: 6000
			}
		};

		if (this.isCMPEnabled) {
			this.prebidConfig.consentManagement = {
				cmpApi: 'iab',
				timeout: this.timeout,
				allowAuctionWithoutConsent: false
			};
		}

		window.pbjs = window.pbjs || {};
		window.pbjs.que = window.pbjs.que || [];
		window.pbjs.que.push(() => {
			window.pbjs.setConfig(this.prebidConfig);
		});
	}

	static validResponseStatusCode = 1;
	static errorResponseStatusCode = 2;

	callBids(bidsBackHandler) {
		if (this.adUnits.length > 0) {
			window.pbjs.que.push(() => {
				window.pbjs.bidderSettings = getSettings();
			});

			window.pbjs.que.push(() => {
				this.removeAdUnits();

				window.pbjs.requestBids({
					adUnits: this.adUnits,
					bidsBackHandler
				});
			});
		}
	}

	removeAdUnits() {
		(window.pbjs.adUnits || []).forEach((adUnit) => {
			window.pbjs.removeAdUnit(adUnit.code);
		});
	}

	getBestPrice(slotName) {
		return getPrebidBestPrice(slotName);
	}

	getTargetingParams(slotName) {
		let slotParams = {};

		if (window.pbjs && typeof window.pbjs.getBidResponsesForAdUnitCode === 'function') {
			const bids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

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

				slotParams = bidParams.adserverTargeting;
			}
		}

		return slotParams || {};
	}

	isSupported(slotName) {
		return this.adUnits && this.adUnits.some(
			adUnit => adUnit.code === slotName
		);
	}
}
