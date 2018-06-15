import { BaseBidder } from './../base-bidder';
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

		// ToDo: CONFIG
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
