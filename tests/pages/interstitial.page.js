import { slots } from '../common/slot-registry';
import { timeouts } from '../common/timeouts';

class Interstitial {
	constructor() {
		this.pageLink = 'templates/interstitial/';
		this.closeButton = `${slots.invisibleHighImpact.selector} .button-close`;
		this.stopScrolling = '.stop-scrolling';
	}

	closeInterstitial() {
		$(interstitial.closeButton).waitForDisplayed(timeouts.standard);
		$(interstitial.closeButton).click();
	}
}

export const interstitial = new Interstitial();
