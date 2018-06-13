import { BaseBidder } from './../base-bidder';
import { getSettings } from './prebid-settings';
import { setupAdUnits } from './prebid-helper';

export class Prebid extends BaseBidder {
	constructor(...args) {
		super(...args);

		this.logGroup = 'prebid-bidder';
		this.name = 'prebid';
		this.adUnits = setupAdUnits(this.bidderConfig);
	}

	call(bidsBackHandler) {
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

























	isSlotSupported(slotName) {
		return this.adUnits.some((adUnit) => {
			return adUnit.code === slotName;
		});
	}

	getSlotParams(slotName) {
		let params;

		if (window.pbjs && typeof window.pbjs.getAdserverTargetingForAdUnitCode === 'function') {
			params = window.pbjs.getAdserverTargetingForAdUnitCode(slotName) || {};
		}

		return params || {};
	}
}
